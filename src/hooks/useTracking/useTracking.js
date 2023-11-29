import { useCallback } from 'react';

import { getBreadcrumbCategoryId } from '@app/components/overrides/ProductFullDetail/useProductFullDetail';
import useGtm from '@app/hooks/useTracking/useGtm';

export const TrackingActions = {
    trackAddToCart: 'TRACKING/ADD_TO_CART',
    trackOpenCheckout: 'TRACKING/OPEN_CHECKOUT',
    trackPurchase: 'TRACKING/PURCHASE',
    trackProductView: 'TRACKING/PRODUCT_VIEW',
    trackRemoveFromCart: 'TRACKING/REMOVE_FROM_CART',
    trackProductImpression: 'TRACKING/PRODUCT_IMPRESSION',
    trackProductDetails: 'TRACKING/PRODUCT_DETAILS',
    trackProductClick: 'TRACKING/PRODUCT_CLICK'
};

const useTracking = () => {
    const { handleEvent: handleGtmEvent } = useGtm();

    const handleEvent = useCallback(
        (type, payload) => {
            const action = { type, payload };
            handleGtmEvent(action);
        },
        [handleGtmEvent]
    );

    const trackAddToCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackAddToCart, payload);
        },
        [handleEvent]
    );

    const trackOpenCheckout = useCallback(
        payload => {
            handleEvent(TrackingActions.trackOpenCheckout, payload);
        },
        [handleEvent]
    );

    const trackPurchase = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPurchase, payload);
        },
        [handleEvent]
    );

    const trackProductView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductView, payload);
        },
        [handleEvent]
    );

    const trackRemoveFromCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackRemoveFromCart, payload);
        },
        [handleEvent]
    );

    const trackProductDetails = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductDetails, payload);
        },
        [handleEvent]
    );

    const trackProductImpression = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductImpression, payload);
        },
        [handleEvent]
    );

    const trackProductClick = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductClick, payload);
        },
        [handleEvent]
    );

    const getProductCategories = useCallback(categories => {
        if (!categories || !categories.length) {
            return '';
        }

        const categoryId = getBreadcrumbCategoryId(categories);
        const category = categories.find(cat => cat.id === categoryId);

        if (category) {
            return `${(category.breadcrumbs &&
                category.breadcrumbs.map(breadcrumb => breadcrumb.category_name).join('/') + '/') ||
                ''}${category.name}`;
        }
    }, []);

    return {
        trackAddToCart,
        trackProductDetails,
        trackOpenCheckout,
        trackPurchase,
        trackProductView,
        trackRemoveFromCart,
        trackProductClick,
        trackProductImpression,
        getProductCategories
    };
};

export default useTracking;
