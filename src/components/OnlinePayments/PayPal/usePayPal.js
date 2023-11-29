import { useMutation } from '@apollo/client';
import { useEffect } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { setPaymentMethodOnCartInitMutation } from './payPal.gql';

export const usePayPal = ({ onPaymentSuccess, onPaymentError }) => {
    const [, { addToast }] = useToasts();
    const [{ cartId }] = useCartContext();
    const { setIsPaymentDone } = useCheckoutProvider();

    const [updatePaymentMethod] = useMutation(setPaymentMethodOnCartInitMutation, {
        onError: error => {
            onPaymentError();
            setIsPaymentDone(false);
            addToast({
                type: ToastType.ERROR,
                message: error.message
            });
        },
        onCompleted: () => {
            onPaymentSuccess();
            setIsPaymentDone(true);
        }
    });

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        updatePaymentMethod({
            variables: { cartId }
        });
    }, []);
};
