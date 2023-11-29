import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useRef } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { ACCOUNT_FIELD, ROUTING_FIELD, SAVE_FIELD, TYPE_FIELD, ACCOUNT_TYPE_CONFIG, VAULT_FIELD } from './echeckConfig';
import { saveEcheckOnCartMutation } from './echeckPayment.gql';
import { useVault } from './useVault';

export const useEcheckPayment = ({ shouldSubmit, onPaymentSuccess }) => {
    const [, { addToast }] = useToasts();
    const [{ cartId }] = useCartContext();
    const { setIsPaymentDone, setIsPaymentLoading } = useCheckoutProvider();

    const echeckFormRef = useRef(null);
    const setEcheckFormApi = useCallback(api => (echeckFormRef.current = api), []);

    const { isVault, toggleVault, allowVault, vaultConfig, vaultLoading, handleVaultSubmit } = useVault({
        cartId,
        setIsPaymentLoading,
        setIsPaymentDone
    });

    const [saveEcheckMethod] = useMutation(saveEcheckOnCartMutation, {
        onError: error => {
            setIsPaymentDone(false);
            addToast({
                type: ToastType.ERROR,
                message: error.message
            });
        },
        onCompleted: () => {
            setIsPaymentDone(true);
        }
    });

    // Initial state after payment is selected
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        setIsPaymentDone(false);
        onPaymentSuccess();
    }, []);

    const handleFormSubmit = useCallback(
        field => {
            setIsPaymentLoading(true);
            const save = field[SAVE_FIELD] ? field[SAVE_FIELD] : false;
            saveEcheckMethod({
                variables: {
                    cartId: cartId,
                    routingNumber: field[ROUTING_FIELD],
                    accountNumber: field[ACCOUNT_FIELD],
                    accountType: field[TYPE_FIELD],
                    save
                }
            }).then(() => {
                setIsPaymentLoading(false);
            });
        },
        [setIsPaymentLoading, saveEcheckMethod, cartId]
    );

    useEffect(() => {
        if (shouldSubmit) {
            echeckFormRef.current.submitForm();
        }
    }, [shouldSubmit, isVault]);

    const initialValues = {
        [TYPE_FIELD]: ACCOUNT_TYPE_CONFIG[1] ? ACCOUNT_TYPE_CONFIG[1].value : '',
        [VAULT_FIELD]: vaultConfig[1] ? vaultConfig[1].value : ''
    };

    return {
        setEcheckFormApi,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        vaultLoading,
        handleFormSubmit,
        handleVaultSubmit,
        initialValuesEcheck: initialValues
    };
};
