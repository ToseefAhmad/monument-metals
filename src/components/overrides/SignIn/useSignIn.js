import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './useSignIn.gql';

// 10 years in seconds
const REMEMBER_ME_TOKEN_EXPIRATION_TIME = 315360000;

// 1 week in seconds
const TOKEN_EXPIRATION_TIME = 604800;

export const useSignIn = ({
    getCartDetailsQuery,
    setDefaultUsername,
    showCreateAccount,
    showForgotPassword,
    operations: propsOperations
}) => {
    const [, { addToast }] = useToasts();

    const operations = mergeOperations(DEFAULT_OPERATIONS, propsOperations);
    const { createCartMutation, getCustomerQuery, mergeCartsMutation, signInMutation } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [, { setAccountMenuView, closeDrawer }] = useAppContext();
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

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

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

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
                const tokenExpirationTime = rememberMe ? REMEMBER_ME_TOKEN_EXPIRATION_TIME : TOKEN_EXPIRATION_TIME;
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
                        sourceCartId
                    }
                });

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                getCartDetails({ fetchCartId, fetchCartDetails });

                setAccountMenuView('ACCOUNT');
                closeDrawer();
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
            setAccountMenuView,
            closeDrawer,
            addToast
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    return {
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
