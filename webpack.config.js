const fs = require('fs');
const path = require('path');
const { getBuildQueryData } = require('@magebit/pwa-studio-build-query');
const { promisify } = require('util');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const SingleLocalePlugin = require('./Webpack/plugins/SingleLocalePlugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const { configureWebpack, graphQL } = require('@magento/pwa-buildpack');

const { getMediaURL, getStoreConfigData, getAvailableStoresConfigData, getPossibleTypes } = graphQL;

const { DefinePlugin } = webpack;

const getCleanTemplate = templateFile => {
    return new Promise(resolve => {
        fs.readFile(templateFile, 'utf8', (err, data) => {
            resolve(
                data
                    .replace(/(?<inlineddata><!-- Inlined Data -->.*\s<!-- \/Inlined Data -->)/gs, '')
                    .replace(/(?<inlineddata><!-- GTM -->.*\s<!-- \/GTM -->)/gs, '')
                    .replace(/(?<inlineddata><!-- GTM NS -->.*\s<!-- \/GTM NS -->)/gs, '')
                    .replace(/(?<inlineddata><!-- StoreConfig -->.*\s<!-- \/StoreConfig -->)/gs, '')
                    .replace(/(?<inlineddata><!-- OlarkLiveChat -->.*\s<!-- \/OlarkLiveChat -->)/gs, '')
                    .replace(/(?<inlineddata><!-- EvidencePixel -->.*\s<!-- \/EvidencePixel -->)/gs, '')
            );
        });
    });
};

module.exports = async env => {
    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/client',
            'apollo-cache-persist',
            'react',
            'react-dom',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk',
            'graphql',
            'graphql-tag',
            'react-router',
            'react-helmet-async'
        ],
        special: {
            'react-feather': {
                esModules: true
            }
        },
        env,
        devServer: {
            disableHostCheck: true // That solved it
        }
    });

    const isWatcher = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes('watch');
    const storedData =
        ((!process.env.npm_lifecycle_event || !process.env.npm_lifecycle_event.includes('watch')) &&
            getBuildQueryData()) ||
        null;
    const mediaUrl = (storedData && storedData.mediaUrl) || (await getMediaURL());
    const storeConfigData = (storedData && storedData.storeConfigData) || (await getStoreConfigData());
    const { availableStores } = (storedData && storedData.availableStores) || (await getAvailableStoresConfigData());
    const writeFile = promisify(fs.writeFile);

    /**
     * Loop the available stores when there is provided STORE_VIEW_CODE
     * in the .env file, because should set the store name from the
     * given store code instead of the default one.
     */
    const availableStore = availableStores.find(({ code }) => code === process.env.STORE_VIEW_CODE);

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;
    global.LOCALE = storeConfigData.locale.replace('_', '-');
    global.AVAILABLE_STORE_VIEWS = availableStores;

    const possibleTypes = (storedData && storedData.possibleTypes) || (await getPossibleTypes());

    const htmlWebpackConfig = {
        filename: 'index.html',
        minify: {
            collapseWhitespace: true,
            removeComments: true
        }
    };

    // Strip UPWARD mustache from template file during watch
    if (isWatcher) {
        const devTemplate = await getCleanTemplate('./template.html');

        // Generate new gitignored html file based on the contents of cleaned template
        await writeFile('template.generated.html', devTemplate);
        htmlWebpackConfig.template = './template.generated.html';
    } else {
        htmlWebpackConfig.template = './template.html';
    }

    let localizationOpts;

    config.module.noParse = [/@adobe\/adobe\-client\-data\-layer/, /braintree\-web\-drop\-in/];
    config.plugins = [
        ...config.plugins.filter(plugin => {
            if (plugin.constructor.name === 'LocalizationPlugin') {
                localizationOpts = plugin.opts;

                return false;
            }

            return true;
        }),
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            POSSIBLE_TYPES: JSON.stringify(possibleTypes),
            STORE_NAME: availableStore
                ? JSON.stringify(availableStore.store_name)
                : JSON.stringify(storeConfigData.store_name),
            STORE_VIEW_CODE: process.env.STORE_VIEW_CODE
                ? JSON.stringify(process.env.STORE_VIEW_CODE)
                : JSON.stringify(storeConfigData.code),
            AVAILABLE_STORE_VIEWS: JSON.stringify(availableStores),
            DEFAULT_LOCALE: JSON.stringify(global.LOCALE),
            DEFAULT_COUNTRY_CODE: JSON.stringify(process.env.DEFAULT_COUNTRY_CODE || 'US')
        }),
        new HTMLWebpackPlugin(htmlWebpackConfig),
        new SingleLocalePlugin({
            ...localizationOpts,
            injectLocale: 'en_US'
        })
    ];

    if (!isWatcher && config.mode === 'production') {
        config.optimization.minimizer = config.optimization.minimizer.map(minimizer => {
            if (minimizer.constructor.name === 'TerserPlugin') {
                return new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        ecma: 8,
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            drop_console: true
                        },
                        output: {
                            ecma: 7,
                            semicolons: false
                        }
                    }
                })
            }

            return minimizer;
        });
    }

    /**
     * Alias '@app' for the 'src' directory
     */
    config.resolve.alias['@app'] = path.resolve(__dirname, 'src');

    return config;
};
