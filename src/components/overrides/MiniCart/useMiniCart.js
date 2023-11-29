import { useQuery, useMutation } from '@apollo/client';
import { useCallback, useMemo, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useStoreConfig } from '@app/hooks/useStoreConfig';
import useTracking from '@app/hooks/useTracking/useTracking';
import { getCartItemSimpleSku } from '@app/util/getCartItemSimpleSku';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './miniCart.gql';

/**
 *
 * @param {Function} props.setIsOpen - Function to toggle the mini cart
 * @param {DocumentNode} props.operations.miniCartQuery - Query to fetch mini cart data
 * @param {DocumentNode} props.operations.removeItemMutation - Mutation to remove an item from cart
 *
 * @returns {
 *      closeMiniCart: Function,
 *      errorMessage: String,
 *      handleEditCart: Function,
 *      handleProceedToCheckout: Function,
 *      handleRemoveItem: Function,
 *      loading: Boolean,
 *      productList: Array<>,
 *      subTotal: Number,
 *      totalQuantity: Number
 *      configurableThumbnailSource: String
 *  }
 */
export const useMiniCart = props => {
    const { setIsOpen } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { removeItemMutation, updateItemQuantityMutation, miniCartQuery } = operations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();
    const location = useLocation();

    const { getProductCategories, trackRemoveFromCart } = useTracking();

    const { data: miniCartData, loading: miniCartLoading } = useQuery(miniCartQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { cartId },
        skip: !cartId
    });

    const { storeConfig } = useStoreConfig({
        fields: ['configurable_thumbnail_source', 'product_url_suffix']
    });

    const configurableThumbnailSource = useMemo(() => storeConfig?.configurable_thumbnail_source, [storeConfig]);
    const storeUrlSuffix = useMemo(() => storeConfig?.product_url_suffix, [storeConfig]);

    const [removeItem, { loading: removeItemLoading, called: removeItemCalled, error: removeItemError }] = useMutation(
        removeItemMutation
    );

    const totalQuantity = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.total_quantity;
        }
    }, [miniCartData, miniCartLoading]);

    const subTotal = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.prices.subtotal_excluding_tax;
        }
    }, [miniCartData, miniCartLoading]);

    const productList = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.items;
        }
    }, [miniCartData, miniCartLoading]);

    const closeMiniCart = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [location, setIsOpen]);

    const handleRemoveItem = useCallback(
        async (id, item, prices) => {
            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });
                trackRemoveFromCart({
                    currencyCode: prices.price.currency,
                    priceValue: prices.price.value,
                    products: [
                        {
                            sku: getCartItemSimpleSku({ product: item }),
                            quantity: item.quantity,
                            price: prices.price.value,
                            currency: prices.price.currency,
                            category: getProductCategories(item.categories),
                            name: item.name
                        }
                    ]
                });
            } catch {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, getProductCategories, removeItem, trackRemoveFromCart]
    );

    const [
        updateItemQuantity,
        { loading: updateItemQuantityLoading, called: updateItemQuantityCalled, error: updateItemQuantityError }
    ] = useMutation(updateItemQuantityMutation);

    const handleUpdateItemQuantity = useCallback(
        async (quantity, id) => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: id,
                        quantity
                    }
                });
            } catch {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, updateItemQuantity]
    );

    const handleProceedToCheckout = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([removeItemError, updateItemQuantityError]), [
        removeItemError,
        updateItemQuantityError
    ]);

    return {
        closeMiniCart,
        errorMessage: derivedErrorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        handleUpdateItemQuantity,
        loading:
            miniCartLoading ||
            (removeItemCalled && removeItemLoading) ||
            updateItemQuantityLoading ||
            (updateItemQuantityCalled && updateItemQuantityLoading),
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    };
};
