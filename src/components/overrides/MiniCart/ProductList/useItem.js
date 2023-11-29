import { useState, useEffect, useCallback } from 'react';

import useTracking from '@app/hooks/useTracking/useTracking';

export const useItem = ({
    uid,
    product,
    prices,
    loading,
    handleRemoveItem,
    handleUpdateItemQuantity,
    closeMiniCart
}) => {
    const { getProductCategories, trackProductClick } = useTracking();

    const [isLoading, setIsLoading] = useState(false);

    const removeItem = useCallback(() => {
        setIsLoading(true);
        handleRemoveItem(uid, product, prices);
    }, [handleRemoveItem, prices, product, uid]);

    const updateItemQuantity = useCallback(
        quantity => {
            setIsLoading(true);
            handleUpdateItemQuantity(quantity, uid);
        },
        [handleUpdateItemQuantity, uid]
    );

    const handleLinkClick = useCallback(() => {
        closeMiniCart();
        trackProductClick({
            listName: 'Mini Cart',
            product: {
                sku: product.sku,
                name: product.name,
                price: prices.price.value,
                currency: prices.price.currency,
                category: getProductCategories(product.categories)
            }
        });
    }, [closeMiniCart, getProductCategories, product, prices, trackProductClick]);

    useEffect(() => {
        !loading && setIsLoading(false);
    }, [loading]);

    return {
        isLoading,
        removeItem,
        updateItemQuantity,
        handleLinkClick
    };
};
