import { array, func, shape, string } from 'prop-types';
import React, { Suspense, useCallback } from 'react';
import { AlertCircle as AlertCircleIcon, CloudOff as CloudOffIcon, Wifi as WifiIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import Icon from '@app/components/overrides/Icon';
import Main from '@app/components/overrides/Main';
import Mask from '@app/components/overrides/Mask';
import Routes from '@app/components/overrides/Routes';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useDelayedTransition from '@magento/peregrine/lib/hooks/useDelayedTransition';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { HeadProvider, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import globalCSS from '@magento/venia-ui/lib/index.module.css';

const ToastContainer = React.lazy(() =>
    import(/* webpackChunkName: "toastContainer" */ '@app/components/overrides/ToastContainer')
);
const TrustpilotWidgetProvider = React.lazy(() =>
    import(/* webpackChunkName: "trustpilotWidgetProvider" */ '@app/components/TrustpilotWidgetProvider')
);

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    useDelayedTransition();

    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const handleIsOffline = useCallback(() => {
        addToast({
            type: ToastType.ERROR,
            icon: OfflineIcon,
            message: formatMessage({
                id: 'app.errorOffline',
                defaultMessage: 'You are offline. Some features may be unavailable.'
            }),
            timeout: false
        });
    }, [addToast, formatMessage]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: ToastType.INFO,
            icon: OnlineIcon,
            message: formatMessage({
                id: 'app.infoOnline',
                defaultMessage: 'You are online.'
            })
        });
    }, [addToast, formatMessage]);

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                type: ToastType.ERROR,
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: false
            };

            addToast(errorToastProps);
        },
        [ERROR_MESSAGE, addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    if (renderError) {
        return (
            <HeadProvider>
                <StoreTitle />
                <Main isMasked={true} />
                <Mask isActive={true} />
                <Suspense fallback={null}>
                    <ToastContainer />
                </Suspense>
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <StoreTitle />
            <Routes />
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <Suspense fallback={null}>
                <TrustpilotWidgetProvider />
                <ToastContainer />
            </Suspense>
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

App.globalCSS = globalCSS;

export default App;
