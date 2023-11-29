import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import {
    generateLinkTokenMutation,
    savePlaidEcheckOnCartMutation
} from '@app/components/OnlinePayments/PlaidEcheck/plaidEcheck.gql';
import { VAULT_FIELD } from '@app/components/OnlinePayments/PlaidEcheck/plaidEcheckConfig';
import { useVault } from '@app/components/OnlinePayments/PlaidEcheck/useVault';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const usePlaidEcheck = ({ shouldSubmit, onPaymentSuccess }) => {
    const [, { addToast }] = useToasts();
    const [{ cartId }] = useCartContext();
    const { setIsPaymentReady, setIsPaymentDone, setIsPaymentLoading } = useCheckoutProvider();

    const [isPlaidReady, setIsPlaidReady] = useState(false);

    const vaultFormRef = useRef(null);
    const setVaultFormApi = useCallback(api => (vaultFormRef.current = api), []);

    const { isVault, toggleVault, allowVault, vaultConfig, vaultLoading, handleVaultSubmit } = useVault({
        cartId,
        setIsPaymentLoading,
        setIsPaymentDone,
        setIsPaymentReady,
        isPlaidReady
    });

    const [generateLinkToken, { data: linkTokenData, loading: linkTokenLoading }] = useMutation(
        generateLinkTokenMutation
    );

    const [savePayment] = useMutation(savePlaidEcheckOnCartMutation, {
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
        setIsPaymentReady(false);
        generateLinkToken().then(() => {
            onPaymentSuccess();
        });
    }, []);

    const onPlaidSuccess = useCallback((publicToken, metadata) => {
        savePayment({
            variables: {
                cartId: cartId,
                token: publicToken,
                metadata: JSON.stringify(metadata),
                save: true
            }
        }).then(() => {
            setIsPlaidReady(true);
            setIsPaymentLoading(false);
            setIsPaymentReady(true);
        });
    }, []);

    useEffect(() => {
        if (shouldSubmit && isVault) {
            vaultFormRef.current.submitForm();
        }
    }, [shouldSubmit, isVault]);

    const initialValues = {
        [VAULT_FIELD]: vaultConfig[1] ? vaultConfig[1].value : ''
    };

    return {
        setVaultFormApi,
        linkTokenLoading,
        linkToken: linkTokenData?.generateLinkToken,
        onPlaidSuccess,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        vaultLoading,
        handleVaultSubmit,
        initialValues
    };
};
