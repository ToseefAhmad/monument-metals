import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import {
    COLLECT_CONFIG,
    GW_NUM_ID,
    GW_EXP_ID,
    GW_CVV_ID,
    SCRIPT_ID,
    COLLECT_PATH,
    SCRIPT_TOKEN_FIELD
} from '@app/components/OnlinePayments/NmiPayment/nmiConfig';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useToggle from '@app/hooks/useToggle';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { getCartTotalQuery, getNmiPaymentConfigQuery } from './sharedCc.gql';
import { useSharedVault } from './useSharedVault';

export const useSharedCc = ({ shouldSubmit, onPaymentSuccess, mutations, sharedConfig }) => {
    const [{ cartId }] = useCartContext();
    const { setIsPaymentDone, setIsPaymentLoading } = useCheckoutProvider();
    const [, { addToast }] = useToasts();
    const { savePayment, savePaymentCC } = mutations;
    const {
        vaultFormRef,
        setVaultFormApi,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        handleVaultSubmit
    } = useSharedVault({ cartId, setIsPaymentLoading, setIsPaymentDone, mutations });

    // Shared CC / Script state
    const [isCcAllowed, setIsCcAllowed] = useState(false);
    const [isScriptLoaded, setScriptLoaded] = useState(false);

    // CC validation state
    const [isValidNum, setIsValidNum] = useState(false);
    const [isValidExp, setIsValidExp] = useState(false);
    const [isValidCvv, setIsValidCvv] = useState(false);
    // Generalized validation state
    const [isValidCc, setIsValidCc] = useState(false);

    // Save CC to vault
    const [isSaveCc, toggleSaveCc] = useToggle(false);
    const [isConfirmed, toggleConfirmed] = useToggle(false);

    // NMI callback response.
    const [nmiResponse, setNmiResponse] = useState(false);

    // Initialize configs
    const { data: configData, loading: configLoading } = useQuery(getNmiPaymentConfigQuery);
    const { data: cartData, loading: cartLoading } = useQuery(getCartTotalQuery, {
        variables: { cartId },
        fetchPolicy: 'no-cache'
    });

    const config = configData && configData.storeConfig;
    const cart = cartData && cartData.cart;

    // Save CC method data after processing
    const [saveCcMethod] = useMutation(savePaymentCC, {
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

    // Save non-CC method data after processing
    const [saveDefaultMethod] = useMutation(savePayment, {
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

    useEffect(() => {
        if (cartLoading) {
            return;
        }

        const total = cart.prices.grand_total.value;
        const allowedTotal = parseFloat(sharedConfig.amount);

        if (total >= allowedTotal && !!parseInt(sharedConfig.active)) {
            setIsCcAllowed(true);
        } else {
            setIsCcAllowed(false);
        }
    }, [sharedConfig, cart, cartLoading]);

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
        if (!isCcAllowed || configLoading) {
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
    }, [isCcAllowed, config, configLoading]);

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
        if (isCcAllowed && isScriptLoaded && !isVault) {
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
    }, [isCcAllowed, isScriptLoaded, isVault]);

    // Starts the payment if shouldSubmit = true
    useEffect(() => {
        if (shouldSubmit) {
            // Fallback to default if not allowed
            if (!isCcAllowed) {
                setIsPaymentLoading(true);
                saveDefaultMethod({
                    variables: {
                        cartId: cartId
                    }
                }).then(() => {
                    setIsPaymentLoading(false);
                });
                return;
            }

            // Submit vault form, separate logic @ useVault
            if (isVault) {
                vaultFormRef.current.submitForm();
                return;
            }

            // Process CC data
            if (isValidCc && isConfirmed) {
                window.CollectJS.startPaymentRequest();
                setIsPaymentLoading(true);
            } else {
                addToast({
                    type: ToastType.ERROR,
                    message: 'CC Validation Error: Please check your CC data'
                });
            }
        }
    }, [shouldSubmit]);

    return {
        cartLoading,
        isScriptLoaded,
        configLoading,
        isCcAllowed,
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    };
};
