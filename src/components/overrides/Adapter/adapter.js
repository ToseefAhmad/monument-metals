import { ApolloProvider } from '@apollo/client';
import { node } from 'prop-types';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import MainShimmer from '../Main/main.shimmer';

import { WindowSizeContextProvider } from '@magento/peregrine';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';

const Adapter = props => {
    const talonProps = useAdapter(props);
    const { apolloProps, initialized, reduxProps, routerProps, urlHasStoreCode } = talonProps;

    if (!initialized) {
        return (
            <WindowSizeContextProvider>
                <MainShimmer />
            </WindowSizeContextProvider>
        );
    }

    const children = props.children || <App />;
    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <BrowserRouter {...routerProps}>
                    {storeCodeRouteHandler}
                    <AppContextProvider>{children}</AppContextProvider>
                </BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

Adapter.propTypes = {
    children: node
};

export default Adapter;
