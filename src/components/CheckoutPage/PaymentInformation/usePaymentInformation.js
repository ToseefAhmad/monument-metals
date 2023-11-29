import { useApolloClient } from '@apollo/client';
import { useCallback, useEffect } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentInformation.gql';

export const usePaymentInformation = ({ onSave, checkoutError, resetShouldSubmit, onError }) => {
    const { getPaymentNonceQuery } = DEFAULT_OPERATIONS;

    const [{ cartId }] = useCartContext();
    const client = useApolloClient();

    const handlePaymentSuccess = useCallback(() => {
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        resetShouldSubmit();
        onError();
    }, [onError, resetShouldSubmit]);

    const clearPaymentDetails = useCallback(() => {
        client.writeQuery({
            query: getPaymentNonceQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    paymentNonce: null
                }
            }
        });
    }, [cartId, client, getPaymentNonceQuery]);

    const handleExpiredPaymentError = useCallback(() => {
        clearPaymentDetails({ variables: { cartId } });
        resetShouldSubmit();
    }, [resetShouldSubmit, clearPaymentDetails, cartId]);

    useEffect(() => {
        if (checkoutError instanceof CheckoutError && checkoutError.hasPaymentExpired()) {
            handleExpiredPaymentError();
        }
    }, [checkoutError, handleExpiredPaymentError]);

    return {
        handlePaymentError,
        handlePaymentSuccess
    };
};
