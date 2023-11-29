import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import useToggle from '@app/hooks/useToggle';

import { getSavedPaymentsQuery, saveVaultOnCartMutation } from './plaidEcheck.gql';
import { METHOD_CODE, VAULT_FIELD, VAULT_PLACEHOLDER } from './plaidEcheckConfig';

export const useVault = ({ cartId, setIsPaymentLoading, setIsPaymentDone, setIsPaymentReady, isPlaidReady }) => {
    const [, { addToast }] = useToasts();
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
            setAllowVault(true);
            toggleVault();
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
                    const { institution, account_name, mask } = JSON.parse(details);

                    return {
                        key: public_hash,
                        value: public_hash,
                        label: institution + ' - ' + account_name + ' - ' + mask
                    };
                });

            setVaultConfig([VAULT_PLACEHOLDER, ...filteredConfig]);
        }
    }, [vaultData, vaultLoading]);

    useEffect(() => {
        if (isVault || (!isVault && isPlaidReady)) {
            setIsPaymentReady(true);
        } else {
            setIsPaymentReady(false);
        }
    }, [isVault, isPlaidReady, setIsPaymentReady]);

    return {
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        vaultLoading,
        handleVaultSubmit
    };
};
