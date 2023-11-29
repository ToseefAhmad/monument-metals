import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { priceFreezeResetMutation } from '@app/components/PriceFreeze/priceFreeze.gql';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/cartPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * This talon contains logic for a cart page component.
 * It performs effects and returns prop data for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Manages the updating state of the cart while cart details data is being fetched
 *
 * @function
 *
 * @param {Object} props
 * @param {CartPageQueries} props.queries GraphQL queries
 *
 * @returns {CartPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
 */
export const useCartPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCartDetailsQuery } = operations;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const [, { addToast }] = useToasts();

    const [isCartUpdating, setIsCartUpdating] = useState(false);
    const [refreshPayment, setRefreshPayment] = useState(false);
    const [isPaymentSelected, setIsPaymentSelected] = useState(false);
    const [wishlistSuccessProps, setWishlistSuccessProps] = useState(null);

    const [fetchCartDetails, { called, data, loading }] = useLazyQuery(getCartDetailsQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [resetPriceFreeze] = useMutation(priceFreezeResetMutation, {
        fetchPolicy: 'no-cache'
    });

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    const cartItems = useMemo(() => {
        return (data && data.cart.items) || [];
    }, [data]);

    const cartErrors = useMemo(() => {
        return (data && data.cart.item_errors) || [];
    }, [data]);

    const hasOutOfStockItem = useMemo(() => {
        if (cartItems) {
            const isOutOfStock = cartItems.find(cartItem => {
                const { product } = cartItem;
                const { stock_status: stockStatus } = product;

                return stockStatus === 'OUT_OF_STOCK';
            });

            return !!isOutOfStock;
        }
    }, [cartItems]);

    const hasItemErrors = useMemo(() => {
        return !!cartErrors.length;
    }, [cartErrors]);

    const onAddToWishlistSuccess = useCallback(successToastProps => {
        setWishlistSuccessProps(successToastProps);
    }, []);

    const disablePriceFreeze = useCallback(() => {
        resetPriceFreeze({
            variables: {
                cartId
            }
        });
    }, [resetPriceFreeze, cartId]);

    useEffect(() => {
        if (cartId) {
            disablePriceFreeze();
        }
    }, [cartId, disablePriceFreeze]);

    useEffect(() => {
        if (cartId) {
            fetchCartDetails({ variables: { cartId } });
        }
    }, [cartId, fetchCartDetails]);

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    useEffect(() => {
        setRefreshPayment(true);
    }, [isCartUpdating]);

    useEffect(() => {
        if (cartErrors) {
            cartErrors.map(error => {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            });
        }
    }, [addToast, cartErrors]);

    return {
        cartItems,
        hasOutOfStockItem,
        hasItemErrors,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
        isPaymentSelected,
        setIsPaymentSelected,
        refreshPayment,
        setRefreshPayment,
        isSignedIn
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} CartPageQueries
 *
 * @property {GraphQLAST} getCartDetailsQuery Query for getting the cart details.
 *
 * @see [cartPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} CartPageTalonProps
 *
 * @property {Array<Object>} cartItems An array of item objects in the cart.
 * @property {boolean} hasItems True if the cart has items. False otherwise.
 * @property {boolean} isCartUpdating True if the cart is updating. False otherwise.
 * @property {function} setIsCartUpdating Callback function for setting the updating state of the cart page.
 * @property {boolean} shouldShowLoadingIndicator True if the loading indicator should be rendered. False otherwise.
 */
