import { node } from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

import { usePriceFreeze } from '@app/components/PriceFreeze/usePriceFreeze';

const CheckoutContext = createContext(undefined);
const { Provider } = CheckoutContext;

const CheckoutProvider = ({ children }) => {
    // Selected country code from address form or address book to get available shipping methods
    const [shippingAddressCountryCode, setShippingAddressCountryCode] = useState(null);

    // Available shipping methods
    const [isAvailableShippingMethods, setIsAvailableShippingMethods] = useState(false);

    // Active payment method
    const [activePaymentMethod, setActivePaymentMethod] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Additional payment handling after place order.
    // Meant mostly for non-static payment methods (e.g. CC)
    const [isPaymentDone, setIsPaymentDone] = useState(false);

    // Additional state for locking the place order button
    const [isPaymentReady, setIsPaymentReady] = useState(true);

    // Payment loader for advanced payment methods. (e.g. CC)
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    // Place order handlers
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isAfterPlacingOrder, setIsAfterPlacingOrder] = useState(false);

    // Price freeze, initialize each time and load checkout immediately afterward
    const {
        runPriceFreeze,
        priceFreezeData,
        checkoutData,
        checkoutDataLoading,
        priceFreezeDateNow,
        priceFreezeDateEnd
    } = usePriceFreeze();

    // Order confirmation page
    const [isOrderConfirmationPage, setIsOrderConfirmationPage] = useState(false);

    // Cart login page
    const [isCartLoginPage, setIsCartLoginPage] = useState(false);

    const contextValue = {
        activePaymentMethod,
        setActivePaymentMethod,
        isUpdating,
        setIsUpdating,
        shippingAddressCountryCode,
        setShippingAddressCountryCode,
        isAvailableShippingMethods,
        setIsAvailableShippingMethods,
        isPaymentDone,
        setIsPaymentDone,
        isPaymentReady,
        setIsPaymentReady,
        isPaymentLoading,
        setIsPaymentLoading,
        isPlacingOrder,
        setIsPlacingOrder,
        isAfterPlacingOrder,
        setIsAfterPlacingOrder,
        runPriceFreeze,
        priceFreezeData,
        checkoutData,
        checkoutDataLoading,
        priceFreezeDateNow,
        priceFreezeDateEnd,
        isOrderConfirmationPage,
        setIsOrderConfirmationPage,
        isCartLoginPage,
        setIsCartLoginPage
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

CheckoutProvider.propTypes = {
    children: node
};

export default CheckoutProvider;
export const useCheckoutProvider = () => useContext(CheckoutContext);
