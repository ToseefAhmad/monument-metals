import { useQuery } from '@apollo/client';
import { useFormState, useFormApi } from 'informed';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { getPaymentMethodsQuery } from './paymentMethod.gql';

export const usePaymentMethod = ({ onPaymentError, shouldSubmit }) => {
    const { setActivePaymentMethod } = useCheckoutProvider();
    const [{ cartId }] = useCartContext();
    const formApi = useFormApi();
    const formState = useFormState();
    const history = useHistory();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const { data, loading, called } = useQuery(getPaymentMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: { cartId }
    });

    const paymentMethod = (data && data.cart.selected_payment_method) || null;

    useEffect(() => {
        if (called && paymentMethod && !paymentMethod.code) {
            history.push('/cart');
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'paymentMethod.redirectError',
                    defaultMessage: 'Please select a payment method before proceeding with Checkout.'
                })
            });
        }
    }, [addToast, called, formatMessage, history, paymentMethod]);

    useEffect(() => {
        if (paymentMethod) {
            setActivePaymentMethod(paymentMethod.code);
        }
    }, [paymentMethod, setActivePaymentMethod]);

    useEffect(() => {
        if (shouldSubmit) {
            formApi.validate();
            formState.invalid && onPaymentError();
        }
    }, [formApi, formState.invalid, onPaymentError, shouldSubmit]);

    return {
        paymentMethod,
        isLoading: loading
    };
};
