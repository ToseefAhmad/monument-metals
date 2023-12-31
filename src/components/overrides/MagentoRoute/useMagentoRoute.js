import { useLazyQuery } from '@apollo/client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import { getRootComponent, isRedirect } from '@magento/peregrine/lib/talons/MagentoRoute/helpers';
import { getComponentData } from '@magento/peregrine/lib/util/magentoRouteData';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './magentoRoute.gql';

const getInlinedPageData = () => {
    return globalThis.INLINED_PAGE_TYPE && globalThis.INLINED_PAGE_TYPE.type ? globalThis.INLINED_PAGE_TYPE : null;
};

const resetInlinedPageData = () => {
    globalThis.INLINED_PAGE_TYPE = false;
};

export const useMagentoRoute = (props = {}) => {
    const { skipRedirect = false } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();

    const [redirectUrl, setRedirectUrl] = useState('');

    const initialized = useRef(false);
    const fetchedPathname = useRef(null);
    const fetching = useRef(false);

    const [appState, appApi] = useAppContext();
    const { actions: appActions } = appApi;
    const { nextRootComponent } = appState;
    const { setNextRootComponent, setPageLoading } = appActions;

    const setComponent = useCallback(
        (key, value) => {
            setComponentMap(prevMap => new Map(prevMap).set(key, value));
        },
        [setComponentMap]
    );

    const component = componentMap.get(pathname);

    const [runQuery, queryResult] = useLazyQuery(resolveUrlQuery, {
        onCompleted: async ({ route }) => {
            fetching.current = false;
            if (!component) {
                const { type, ...routeData } = route || {};
                try {
                    const rootComponent = await getRootComponent(type);
                    setComponent(pathname, {
                        component: rootComponent,
                        ...getComponentData(routeData),
                        type
                    });
                } catch (error) {
                    setComponent(pathname, error);
                }
            }
        },
        onError: () => {
            fetching.current = false;
        }
    });

    useEffect(() => {
        if (initialized.current || !getInlinedPageData()) {
            fetching.current = true;
            runQuery({
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
                variables: { url: pathname }
            });
            fetchedPathname.current = pathname;
        }
    }, [initialized, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // destructure the query result
    const { data, error } = queryResult;
    const { route } = data || {};
    const { id, redirect_code, relative_url, type } = route || {};

    // evaluate both results and determine the response type
    const empty = !route || !type || id < 1;
    const redirect = isRedirect(redirect_code);
    const fetchError = component instanceof Error && component;
    const routeError = fetchError || error;
    const isInitialized = initialized.current || !getInlinedPageData();

    let showPageLoader = false;
    let routeData;

    const doubleSlashRegex = new RegExp(/\/\/+/);
    if (component && pathname.match(doubleSlashRegex)) {
        // REDIRECT from url with double slash
        const cleanUrl = pathname.replace(doubleSlashRegex, '/');
        routeData = {
            isRedirect: true,
            relativeUrl: cleanUrl
        };
    } else if (component && !fetchError) {
        // FOUND
        routeData = component;
    } else if (routeError) {
        // ERROR
        routeData = { hasError: true, routeError };
    } else if (redirect) {
        // REDIRECT
        routeData = {
            isRedirect: true,
            relativeUrl: relative_url.startsWith('/') ? relative_url : '/' + relative_url
        };
    } else if (empty && fetchedPathname.current === pathname && !fetching.current) {
        // NOT FOUND
        routeData = { isNotFound: true };
    } else if (nextRootComponent) {
        // LOADING with full page shimmer
        showPageLoader = true;
        routeData = { isLoading: true, shimmer: nextRootComponent };
    } else {
        // LOADING
        const isInitialLoad = !isInitialized;
        routeData = { isLoading: true, initial: isInitialLoad };
    }

    useEffect(() => {
        (async () => {
            const inlinedData = getInlinedPageData();
            if (inlinedData) {
                try {
                    const componentType = inlinedData.type;
                    const rootComponent = await getRootComponent(componentType);
                    setComponent(pathname, {
                        component: rootComponent,
                        type: componentType,
                        ...getComponentData(inlinedData)
                    });
                } catch (error) {
                    setComponent(pathname, error);
                }
            }
            initialized.current = true;
        })();

        return () => {
            // Unmount
            resetInlinedPageData();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect && routeData.relativeUrl !== redirectUrl) {
            setRedirectUrl(routeData.relativeUrl);
        }
    }, [pathname, redirect, redirectUrl, routeData]);

    // It makes sure to replace the url only once
    useEffect(() => {
        if (redirectUrl && !skipRedirect) {
            replace(redirectUrl);
        }
    }, [redirectUrl, replace, skipRedirect]);

    useEffect(() => {
        if (component) {
            // Reset loading shimmer whenever component resolves
            setNextRootComponent(null);
        }
    }, [component, pathname, setNextRootComponent]);

    useEffect(() => {
        setPageLoading(showPageLoader);
    }, [showPageLoader, setPageLoading]);

    return routeData;
};
