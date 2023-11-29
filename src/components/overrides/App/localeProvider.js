import React from 'react';
import { IntlProvider } from 'react-intl';

const LocaleProvider = props => {
    /**
     * At build time, `__localeMessages__` is injected as a global.
     *
     * Please see {SingleLocalePlugin} at Webpack/plugins/SingleLocalePlugin.js
     */
    const messages = __localeMessages__;

    const handleIntlError = error => {
        if (messages) {
            if (error.code === 'MISSING_TRANSLATION') {
                console.warn('Missing translation', error.message);
                return;
            }
            throw error;
        }
    };

    return (
        <IntlProvider
            key={DEFAULT_LOCALE}
            {...props}
            defaultLocale={DEFAULT_LOCALE}
            locale={DEFAULT_LOCALE}
            messages={messages}
            onError={handleIntlError}
        />
    );
};

export default LocaleProvider;
