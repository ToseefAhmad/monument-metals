import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';

import {
    createCartMutation,
    getCustomerQuery,
    mergeCartsMutation,
    signInMutation,
    getSelectedPaymentMethodQuery,
    setSelectedPaymentMethodMutation
} from './useSignIn.gql';

// 10 years in seconds
const REMEMBER_ME_TOKEN_EXPIRATION_TIME = 315360000;

export const useSignIn = ({ getCartDetailsQuery, onCreateAccount, onForgotPassword }) => {
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const [, { addToast }] = useToasts();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const history = useHistory();
    const apolloClient = useApolloClient();

    const { data } = useQuery(getSelectedPaymentMethodQuery, {
        variables: {
            cartId
        }
    });
    const [setPaymentMethod] = useMutation(setSelectedPaymentMethodMutation);
    const [signIn] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });
    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const selectedPaymentMethodCode =
        data && !!data.cart.selected_payment_method.code ? data.cart.selected_payment_method.code : null;

    const handleSubmit = useCallback(
        async ({ email, password, rememberMe }) => {
            setIsSigningIn(true);
            try {
                await executeCaptchaValidation('signin');
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });

                const token = signInResponse.data.generateCustomerToken.token;
                const tokenExpirationTime = rememberMe ? REMEMBER_ME_TOKEN_EXPIRATION_TIME : undefined;
                await setToken(token, tokenExpirationTime);

                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId,
                        mergeItems: false
                    }
                });

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                getCartDetails({ fetchCartId, fetchCartDetails });

                if (selectedPaymentMethodCode) {
                    await setPaymentMethod({
                        variables: {
                            cartId: destinationCartId,
                            paymentCode: selectedPaymentMethodCode
                        }
                    });
                }

                history.push('/checkout');
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            }
            setIsSigningIn(false);
        },
        [
            executeCaptchaValidation,
            cartId,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            setPaymentMethod,
            selectedPaymentMethodCode,
            history,
            addToast
        ]
    );

    const handleForgotPassword = useCallback(() => {
        onForgotPassword();
    }, [onForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        onCreateAccount();
    }, [onCreateAccount]);

    return {
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn
    };
};
