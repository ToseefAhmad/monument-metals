import { useQuery } from '@apollo/client';
import { useCallback } from 'react';

import { useCustomerWishlistSkus } from '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Gallery/gallery.gql';

export const useGallery = ({ loadPrevItems, loadMoreItems }) => {
    useCustomerWishlistSkus();

    const { data: storeConfigData } = useQuery(DEFAULT_OPERATIONS.getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    const handleLoadPrev = useCallback(() => {
        if (loadPrevItems) {
            loadPrevItems();
        }
    }, [loadPrevItems]);

    const handleLoadMore = useCallback(() => {
        if (loadMoreItems) {
            loadMoreItems();
        }
    }, [loadMoreItems]);

    return {
        storeConfig,
        handleLoadPrev,
        handleLoadMore
    };
};
