import { useQuery, useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import useTracking from '@app/hooks/useTracking/useTracking';
import { getCartItemSimpleSku } from '@app/util/getCartItemSimpleSku';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import {
    createCartMutation,
    getOrderDetailsQuery,
    placeOrderMutation,
    getCustomerAddressesQuery
} from './checkoutPage.gql';
import { useCheckoutProvider } from './context';

export const useCheckoutPage = () => {
    const apolloClient = useApolloClient();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const [{ token }] = useUserContext();
    const {
        isUpdating,
        setIsUpdating,
        activePaymentMethod,
        isPaymentDone,
        isPaymentReady,
        isPaymentLoading,
        isPlacingOrder,
        setIsPlacingOrder,
        isAfterPlacingOrder,
        setIsAfterPlacingOrder,
        checkoutData,
        checkoutDataLoading,
        isAvailableShippingMethods,
        setIsOrderConfirmationPage,
        isOrderConfirmationPage
    } = useCheckoutProvider();
    const { isMobileScreen } = useScreenSize();
    const { trackOpenCheckout } = useTracking();

    const { data: preloadedCustomerAddressesData, loading: preloadedCustomerAddressesLoading } = useQuery(
        getCustomerAddressesQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );
    const [fetchCartId] = useMutation(createCartMutation);
    const [placeOrder, { data: placeOrderData, error: placeOrderError, loading: placeOrderLoading }] = useMutation(
        placeOrderMutation
    );
    const [getOrderDetails, { data: orderDetailsData, loading: orderDetailsLoading }] = useLazyQuery(
        getOrderDetailsQuery,
        {
            // We use this query to fetch details _just_ before submission, so we
            // Want to make sure it is fresh. We also don't want to cache this data
            // Because it may contain PII.
            fetchPolicy: 'no-cache'
        }
    );

    const preloadedCustomerAddresses =
        preloadedCustomerAddressesData && preloadedCustomerAddressesData.customer.addresses;

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData.cart.items) || [];
    }, [checkoutData]);

    const isCartEmpty = useMemo(() => {
        return !(checkoutData && checkoutData.cart.total_quantity) || null;
    }, [checkoutData]);

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

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const orderNumber = useMemo(() => {
        return (placeOrderData && placeOrderData.placeOrder.order.order_number) || null;
    }, [placeOrderData]);

    useEffect(() => {
        const isOrderConfirmationPage = !!orderNumber && !!orderDetailsData;

        setIsOrderConfirmationPage(isOrderConfirmationPage);
    }, [orderDetailsData, orderNumber, setIsOrderConfirmationPage]);

    // Scroll into view on error
    const shippingInformationRef = useRef(null);
    const billingAddressRef = useRef(null);
    const paymentInformationRef = useRef(null);
    const termsAndConditionsRef = useRef(null);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView();
        }
    }, [shippingInformationRef]);

    const onShippingInformationError = useCallback(() => {
        setIsShippingInformationDone(false);
        scrollShippingInformationIntoView();
    }, [scrollShippingInformationIntoView]);

    const scrollBillingAddressIntoView = useCallback(() => {
        if (billingAddressRef.current) {
            billingAddressRef.current.scrollIntoView();
        }
    }, [billingAddressRef]);

    const scrollPaymentInformationIntoView = useCallback(() => {
        if (paymentInformationRef.current) {
            paymentInformationRef.current.scrollIntoView();
        }
    }, [paymentInformationRef]);

    const scrollTermsAndConditionsIntoView = useCallback(() => {
        if (termsAndConditionsRef.current) {
            termsAndConditionsRef.current.scrollIntoView();
        }
    }, [termsAndConditionsRef]);

    const onTermsAndConditionsError = useCallback(() => {
        setIsTermsAndConditionsDone(false);

        if (isMobileScreen) {
            scrollTermsAndConditionsIntoView();
        }
    }, [isMobileScreen, scrollTermsAndConditionsIntoView]);

    // Check which checkout steps are done
    const [isShippingInformationDone, setIsShippingInformationDone] = useState(false);
    const [isBillingAddressDone, setIsBillingAddressDone] = useState(false);
    const [isShippingMethodDone, setIsShippingMethodDone] = useState(false);
    const [isPaymentInformationDone, setIsPaymentInformationDone] = useState(false);
    const [isTermsAndConditionsDone, setIsTermsAndConditionsDone] = useState(false);

    const isStepsDone =
        isShippingInformationDone &&
        isBillingAddressDone &&
        isShippingMethodDone &&
        isPaymentInformationDone &&
        isTermsAndConditionsDone;

    const isTermsAndConditionsSticky =
        isShippingInformationDone && isBillingAddressDone && isShippingMethodDone && isPaymentInformationDone;

    const setShippingInformationDone = useCallback(() => {
        setIsShippingInformationDone(true);
    }, [setIsShippingInformationDone]);

    const resetShippingInformationDone = useCallback(() => {
        setIsShippingInformationDone(false);
    }, [setIsShippingInformationDone]);

    const setBillingAddressDone = useCallback(() => {
        setIsBillingAddressDone(true);
    }, [setIsBillingAddressDone]);

    const setShippingMethodDone = useCallback(() => {
        setIsShippingMethodDone(true);
    }, [setIsShippingMethodDone]);

    const setPaymentInformationDone = useCallback(() => {
        setIsPaymentInformationDone(true);
    }, [setIsPaymentInformationDone]);

    const resetBillingAddressDone = useCallback(() => {
        setIsBillingAddressDone(false);
    }, [setIsBillingAddressDone]);

    const setTermsAndConditionsDone = useCallback(() => {
        setIsTermsAndConditionsDone(true);
    }, [setIsTermsAndConditionsDone]);

    const resetTermsAndConditionsDone = useCallback(() => {
        setIsTermsAndConditionsDone(false);
    }, [setIsTermsAndConditionsDone]);

    // Handle review order
    const [isReviewOrder, setReviewOrder] = useState(false);

    const handleReviewOrder = useCallback(() => {
        setReviewOrder(true);
    }, []);

    const resetReviewOrder = useCallback(() => {
        setReviewOrder(false);
    }, []);

    const handlePlaceOrder = useCallback(async () => {
        handleReviewOrder();

        // Validation handlers are done directly inside each component
        if (
            !isShippingInformationDone ||
            !isBillingAddressDone ||
            !isShippingMethodDone ||
            !isPaymentInformationDone ||
            !isTermsAndConditionsDone
        ) {
            console.error(
                `handle checkout error in step - isShippingInformationDone = ${isShippingInformationDone} / isBillingAddressDone = ${isBillingAddressDone} / isShippingMethodDone = ${isShippingMethodDone} / isPaymentInformationDone = ${isPaymentInformationDone} / isTermsAndConditionsDone = ${isTermsAndConditionsDone}`
            );
            return;
        }

        // Fetch order details and then use an effect to actually place the
        // Order. If/when Apollo returns promises for invokers from useLazyQuery
        // We can just await this function and then perform the rest of order
        // Placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });

        setIsPlacingOrder(true);
    }, [
        cartId,
        getOrderDetails,
        handleReviewOrder,
        isBillingAddressDone,
        isPaymentInformationDone,
        isShippingInformationDone,
        isShippingMethodDone,
        isTermsAndConditionsDone,
        setIsPlacingOrder
    ]);

    // Initialize checkout state
    useEffect(() => {
        if (checkoutData && cartItems.length) {
            trackOpenCheckout({
                stepNum: 1,
                products: cartItems.map(item => ({
                    sku: getCartItemSimpleSku(item),
                    name: item.product.name,
                    price: item.prices.price.value,
                    currency: item.prices.price.currency,
                    quantity: item.quantity
                }))
            });
        }
    }, [cartItems, trackOpenCheckout, checkoutData]);

    // On page load - refresh sign in token expiration time by assigning a new one with the same data
    useLayoutEffect(() => {
        const storage = new BrowserPersistence();
        const item = storage.getRawItem('signin_token');

        if (item) {
            const { ttl } = JSON.parse(item);

            storage.setItem('signin_token', token, ttl);
        }
    }, [token]);

    useEffect(() => {
        const placeOrderAndCleanup = async () => {
            try {
                await placeOrder({
                    variables: {
                        cartId
                    }
                });
                // Cleanup stale cart and customer info.
                await removeCart();
                await clearCartDataFromCache(apolloClient);

                await createCart({
                    fetchCartId
                });
            } catch (err) {
                console.error('An error occurred during when placing the order', err);
                setReviewOrder(false);
                setIsAfterPlacingOrder(false);
            }
        };

        if (orderDetailsData && isPlacingOrder && isPaymentDone) {
            setIsAfterPlacingOrder(true);
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        orderDetailsData,
        placeOrder,
        removeCart,
        isPlacingOrder,
        isPaymentDone,
        setIsAfterPlacingOrder,
        setIsPlacingOrder
    ]);

    return {
        activePaymentMethod,
        hasOutOfStockItem,
        error: checkoutError,
        handlePlaceOrder,
        hasError: !!checkoutError,
        isCartEmpty,
        checkoutDataLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setIsUpdating,
        setShippingInformationDone,
        setBillingAddressDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        setTermsAndConditionsDone,
        resetTermsAndConditionsDone,
        onTermsAndConditionsError,
        resetReviewOrder,
        handleReviewOrder,
        isReviewOrder,
        isShippingInformationDone,
        shippingInformationRef,
        billingAddressRef,
        paymentInformationRef,
        termsAndConditionsRef,
        onShippingInformationError,
        scrollBillingAddressIntoView,
        scrollPaymentInformationIntoView,
        resetBillingAddressDone,
        isTermsAndConditionsSticky,
        isStepsDone,
        isPaymentLoading,
        isPaymentReady,
        resetShippingInformationDone,
        isAvailableShippingMethods,
        preloadedCustomerAddressesLoading,
        preloadedCustomerAddresses,
        isOrderConfirmationPage,
        isAfterPlacingOrder
    };
};
