import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useToggle from '@app/hooks/useToggle';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import {
    COLLECT_CONFIG,
    GW_NUM_ID,
    GW_EXP_ID,
    GW_CVV_ID,
    SCRIPT_ID,
    COLLECT_PATH,
    SCRIPT_TOKEN_FIELD
} from './nmiConfig';
import { getNmiPaymentConfigQuery, saveCcOnCartMutation } from './nmiPayment.gql';
import { useVault } from './useVault';

export const useNmiPayment = ({ shouldSubmit, onPaymentSuccess }) => {
    const [{ cartId }] = useCartContext();
    const { setIsPaymentDone, setIsPaymentLoading } = useCheckoutProvider();
    const [, { addToast }] = useToasts();

    const {
        vaultFormRef,
        setVaultFormApi,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        handleVaultSubmit
    } = useVault({ cartId, setIsPaymentLoading, setIsPaymentDone });

    const [isScriptLoaded, setScriptLoaded] = useState(false);

    // CC validation state
    const [isValidNum, setIsValidNum] = useState(false);
    const [isValidExp, setIsValidExp] = useState(false);
    const [isValidCvv, setIsValidCvv] = useState(false);
    // Generalized validation state
    const [isValidCc, setIsValidCc] = useState(false);

    // Save CC to vault
    const [isSaveCc, toggleSaveCc] = useToggle(false);

    // NMI callback response. Clear with "false"
    const [nmiResponse, setNmiResponse] = useState(false);

    // Initialize configs
    const { data: configData, loading: configLoading } = useQuery(getNmiPaymentConfigQuery, {
        skip: !cartId
    });

    const config = configData && configData.storeConfig;

    // Save CC method data after processing
    const [saveCcMethod] = useMutation(saveCcOnCartMutation, {
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

    // Generalize CC validation
    useEffect(() => {
        setIsValidCc(isValidNum && isValidExp && isValidCvv);
    }, [isValidNum, isValidExp, isValidCvv]);

    // Load CollectJS script
    useEffect(() => {
        if (configLoading) {
            return;
        }

        if (config) {
            const { nmi_collectjs_url, nmi_tokenization_key } = config;
            const existingScript = document.getElementById(SCRIPT_ID);
            const collectUrl = nmi_collectjs_url + COLLECT_PATH;

            if (!existingScript && !isScriptLoaded) {
                const script = document.createElement('script');
                script.src = collectUrl;
                script.id = SCRIPT_ID;
                script.setAttribute(SCRIPT_TOKEN_FIELD, nmi_tokenization_key);
                document.body.appendChild(script);
                script.onload = () => {
                    setScriptLoaded(true);
                };
            } else {
                setScriptLoaded(true);
            }
        }
    }, [config, configLoading]);

    // Process NMI response
    useEffect(() => {
        if (nmiResponse) {
            saveCcMethod({
                variables: {
                    cartId: cartId,
                    token: nmiResponse.token,
                    save: isSaveCc,
                    type: nmiResponse.card.type,
                    number: nmiResponse.card.number,
                    exp: nmiResponse.card.exp
                }
            }).then(() => {
                setIsPaymentLoading(false);
                setNmiResponse(false);
            });
        }
    }, [nmiResponse, isSaveCc, cartId]);

    // Configure CollectJS when script is loaded
    useEffect(() => {
        if (isScriptLoaded && !isVault) {
            window.CollectJS.configure({
                ...COLLECT_CONFIG,
                callback: response => {
                    setNmiResponse(response);
                },
                validationCallback: (field, status, message) => {
                    if (field === GW_NUM_ID) setIsValidNum(status);
                    if (field === GW_EXP_ID) setIsValidExp(status);
                    if (field === GW_CVV_ID) setIsValidCvv(status);

                    if (!status) {
                        addToast({
                            type: ToastType.ERROR,
                            message: 'CC Validation Error: ' + message
                        });
                    }
                }
            });
        }
    }, [isScriptLoaded, isVault]);

    // Starts the payment if shouldSubmit = true
    useEffect(() => {
        if (shouldSubmit) {
            // Submit vault form, separate logic @ useVault
            if (isVault) {
                vaultFormRef.current.submitForm();
                return;
            }

            // Process CC data
            if (isValidCc) {
                window.CollectJS.startPaymentRequest();
                setIsPaymentLoading(true);
            } else {
                addToast({
                    type: ToastType.ERROR,
                    message: 'CC Validation Error: Please check your CC data'
                });
            }
        }
    }, [shouldSubmit, isValidCc, isVault]);

    return {
        isLoading: configLoading || !isScriptLoaded,
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    };
};
