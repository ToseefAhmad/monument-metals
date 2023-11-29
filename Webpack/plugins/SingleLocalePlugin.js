const path = require("path");

const debug = require('@magento/pwa-buildpack/lib/util/debug').makeFileLogger(__filename);
const LocalizationPlugin = require('@magento/pwa-buildpack/lib/WebpackTools/plugins/LocalizationPlugin');

const i18nDir = 'i18n';

class SingleLocalePlugin extends LocalizationPlugin
{
    injectLocale = 'en_US';

    async buildFetchModule() {
        const { inputFileSystem, hooks } = this.compiler;
        const { dirs, context, virtualModules } = this.opts;

        // Iterate through every module which declares the i18n specialFlag along with the context venia-concept dir
        const locales = {};
        for (const dir of dirs) {
            const localeDir = path.join(dir, i18nDir);
            try {
                const stats = inputFileSystem.statSync(localeDir);

                if (stats.isDirectory()) {
                    const packageTranslations = await this.findTranslationFiles(
                        inputFileSystem,
                        localeDir
                    );
                    this.mergeLocales(locales, packageTranslations);
                } else {
                    throw new Error('Path is not directory.');
                }
            } catch (e) {
                debug(`${dir} produced an error, this may not be an issue`, e);

                // If the directory declares i18n support, but doesn't contain the directory error the build
                if (dir !== context) {
                    throw new Error(
                        `${dir} module has i18n special flag, but i18n directory does not exist at ${localeDir}.`
                    );
                }
            }
        }

        if (Object.keys(locales).length === 0) {
            debug(
                'No locales found while traversing all modules with i18n flag.'
            );

            return;
        }

        // Merge all located translation files together and return their paths for a dynamic import
        const mergedLocalesPaths = await this.writeMergedVirtualLocales(
            context,
            locales,
            inputFileSystem,
            virtualModules
        );

        debug('Merged locales into path.', mergedLocalesPaths);

        /**
         * Build up our importer factory, this provides a global function called __fetchLocaleData__ which in turn
         * completes a dynamic import of the combined file generated in the step above.
         * @type {string}
         */
        const importerFactory = `function () {
            return async function getLocale(locale) {
                ${Object.keys(locales)
            .map(locale => {
                return `if (locale === "${locale}") {
                        return import(/* webpackChunkName: "i18n-${locale}" */'${
                    mergedLocalesPaths[locale]
                }');
                    }`;
            })
            .join('')}

                throw new Error('Unable to locate locale ' + locale + ' within generated dist directory.');
            }
        }`;

        hooks.afterCompile.tap('LocalizationPlugin', compilation => {
            // Add global file dependencies for all the found translation files
            Object.values(locales).forEach(localePaths => {
                localePaths.forEach(localePath => {
                    compilation.fileDependencies.add(localePath);
                });
            });
        });

        hooks.emit.tap('LocalizationPlugin', compilation => {
            // Add individual fileDependencies for each i18n chunk
            compilation.chunks.forEach(chunk => {
                if (chunk.name && chunk.name.startsWith('i18n')) {
                    chunk.getModules().forEach(chunkModule => {
                        const chunkLocale = path.parse(chunkModule.resource)
                            .name;
                        if (
                            locales[chunkLocale] &&
                            Array.isArray(locales[chunkLocale])
                        ) {
                            locales[chunkLocale].forEach(localePath => {
                                chunkModule.buildInfo.fileDependencies.add(
                                    localePath
                                );
                            });
                        }
                    });
                }
            });
        });

        return `;globalThis.__localeMessages__ = require('${mergedLocalesPaths[this.opts.injectLocale]}');`;
    }
}

module.exports = SingleLocalePlugin;
