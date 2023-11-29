import React from 'react';

import AmXsearchProvider from '@app/components/AdvancedSearch/context';
import CaptchaProvider from '@app/components/CaptchaProvider';
import { ProductAddedModalContextProvider } from '@app/components/ProductAddedModal/useProductAddedModalContext';
import { ToastContextProvider, WindowSizeContextProvider } from '@magento/peregrine';
import LocaleProvider from '@magento/venia-ui/lib/components/App/localeProvider';

import PeregrineContextProvider from './PeregrineContextProvider';

/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    LocaleProvider,
    PeregrineContextProvider,
    WindowSizeContextProvider,
    ToastContextProvider,
    CaptchaProvider,
    AmXsearchProvider,
    ProductAddedModalContextProvider
];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default ContextProvider;
