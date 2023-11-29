import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { getPayPalConfig, createPayPalToken, setPaymentMethodOnCartMutation } from './payPal.gql';

export const usePayPalButton = ({ handlePlaceOrder, disabled }) => {
    const { data, loading: configLoading } = useQuery(getPayPalConfig);
    const configData = !configLoading && data.storeConfig && data.storeConfig;

    const [, { addToast }] = useToasts();
    const [{ cartId }] = useCartContext();
    const { formatMessage } = useIntl();
    const { setIsPaymentDone, setIsPaymentLoading } = useCheckoutProvider();

    const [createToken] = useMutation(createPayPalToken, { variables: { cartId } });

    const generateToken = () => {
        setIsPaymentLoading(true);
        return createToken({
            variables: {
                cartId
            }
        });
    };

    const [setPayment, { loading: paymentLoading }] = useMutation(setPaymentMethodOnCartMutation, {
        onCompleted: () => {
            setIsPaymentDone(true);
            setIsPaymentLoading(false);
            handlePlaceOrder();
        }
    });

    const isDisabled = disabled || paymentLoading;

    const handleSuccess = async data => {
        await setPayment({
            variables: {
                cartId: cartId,
                payerId: data.payerID,
                token: data.orderID
            }
        });
    };

    const handleError = error => {
        console.error('PayPal', error);
        setIsPaymentLoading(false);
        addToast({
            type: ToastType.ERROR,
            message: formatMessage({
                id: 'payPal.genericError',
                defaultMessage: 'PayPal error. Please check your shipping address.'
            })
        });
    };

    const handleCancel = () => {
        setIsPaymentLoading(false);
    };

    return {
        config: configData,
        generateToken,
        configLoading,
        handleSuccess,
        handleError,
        handleCancel,
        isDisabled
    };
};
