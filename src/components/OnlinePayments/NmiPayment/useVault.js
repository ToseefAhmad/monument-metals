import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import useToggle from '@app/hooks/useToggle';

import { METHOD_CODE, VAULT_FIELD, VAULT_PLACEHOLDER } from './nmiConfig';
import { getSavedPaymentsQuery, saveVaultOnCartMutation } from './nmiPayment.gql';

export const useVault = ({ cartId, setIsPaymentLoading, setIsPaymentDone }) => {
    const [, { addToast }] = useToasts();

    // Vault form
    const vaultFormRef = useRef(null);
    const setVaultFormApi = useCallback(api => (vaultFormRef.current = api), []);

    // Vault state
    const [isVault, toggleVault] = useToggle(false);
    const [allowVault, setAllowVault] = useState(false);
    const [vaultConfig, setVaultConfig] = useState({});

    const { data: vaultData, loading: vaultLoading } = useQuery(getSavedPaymentsQuery, {
        skip: !cartId,
        fetchPolicy: 'no-cache'
    });

    // Save Vault Method data after processing
    const [saveVaultMethod] = useMutation(saveVaultOnCartMutation, {
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

    // Handles the vault submit
    const handleVaultSubmit = useCallback(
        field => {
            setIsPaymentLoading(true);
            saveVaultMethod({
                variables: {
                    cartId: cartId,
                    vaultToken: field[VAULT_FIELD]
                }
            }).then(() => {
                setIsPaymentLoading(false);
            });
        },
        [setIsPaymentLoading, saveVaultMethod, cartId]
    );

    useEffect(() => {
        // > 1 because placeholder
        if (vaultConfig.length > 1) {
            setAllowVault(false); // Revert
        }
    }, [vaultConfig, toggleVault]);

    useEffect(() => {
        if (vaultLoading) {
            return;
        }

        if (vaultData.customerPaymentTokens && vaultData.customerPaymentTokens.items) {
            const filteredConfig = vaultData.customerPaymentTokens.items
                .filter(({ payment_method_code }) => {
                    return payment_method_code === METHOD_CODE;
                })
                .map(({ public_hash, details }) => {
                    const { type, lastCcNumber, expirationDate } = JSON.parse(details);
                    const label = [type.toUpperCase(), '**** ' + lastCcNumber, expirationDate].join(', ');

                    return {
                        key: public_hash,
                        value: public_hash,
                        label: label
                    };
                });

            setVaultConfig([VAULT_PLACEHOLDER, ...filteredConfig]);
        }
    }, [vaultData, vaultLoading]);

    return {
        vaultFormRef,
        setVaultFormApi,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        handleVaultSubmit
    };
};
