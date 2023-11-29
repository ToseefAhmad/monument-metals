import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './itemsReview.gql';

export const useItemsReview = props => {
    const [{ cartId }] = useCartContext();

    const { getItemsInCart, getConfigurableThumbnailSource } = DEFAULT_OPERATIONS;
    const { data: configurableThumbnailSourceData } = useQuery(getConfigurableThumbnailSource, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData) {
            return configurableThumbnailSourceData.storeConfig.configurable_thumbnail_source;
        }
    }, [configurableThumbnailSourceData]);

    const [fetchItemsInCart, { data: queryData, error, loading }] = useLazyQuery(getItemsInCart, {
        fetchPolicy: 'cache-and-network'
    });

    // If static data was provided, use that instead of query data.
    const data = props.data || queryData;

    useEffect(() => {
        if (cartId && !props.data) {
            fetchItemsInCart({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchItemsInCart, props.data]);

    const items = data ? data.cart.items : [];

    return {
        isLoading: !!loading,
        items,
        hasErrors: !!error,
        configurableThumbnailSource
    };
};
