import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
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
    createAccountMutation,
    createCartMutation,
    getCartDetailsQuery,
    getCustomerQuery,
    mergeCartsMutation,
    signInMutation,
    getSelectedPaymentMethodQuery,
    setSelectedPaymentMethodMutation
} from './createAccount.gql';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {CreateAccountQueries} props.queries queries used by the talon
 * @param {CreateAccountMutations} props.mutations mutations used by the talon
 * @param {InitialValues} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Function} props.onCancel the cancel callback
 *
 * @returns {CreateAccountProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useForgotPassword } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount.js';
 */
export const useCreateAccount = ({ initialValues = {}, onSubmit, onCancel }) => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const history = useHistory();
    const apolloClient = useApolloClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const {
        captchaHeaders: captchaHeadersSignIn,
        executeCaptchaValidation: executeCaptchaValidationSignIn
    } = useCaptcha();

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    // For create account and sign in mutations, we don't want to cache any
    // Personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [createAccount] = useMutation(createAccountMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });
    const [signIn] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeadersSignIn
        }
    });

    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const { data } = useQuery(getSelectedPaymentMethodQuery, {
        variables: {
            cartId
        }
    });
    const [setPaymentMethod] = useMutation(setSelectedPaymentMethodMutation);

    const selectedPaymentMethodCode =
        data && !!data.cart.selected_payment_method.code ? data.cart.selected_payment_method.code : null;

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                await executeCaptchaValidation('createAccount');

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    }
                });

                await executeCaptchaValidationSignIn('sign_in');

                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    }
                });

                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'createAccount.successMsg',
                        defaultMessage: 'Thank you for registering with Monument Metals'
                    })
                });

                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

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
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                if (selectedPaymentMethodCode) {
                    await setPaymentMethod({
                        variables: {
                            cartId: destinationCartId,
                            paymentCode: selectedPaymentMethodCode
                        }
                    });
                }

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }

                history.push('/checkout');
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
                setIsSubmitting(false);
            }
        },
        [
            cartId,
            executeCaptchaValidation,
            createAccount,
            executeCaptchaValidationSignIn,
            signIn,
            addToast,
            formatMessage,
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
            onSubmit,
            history
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    return {
        handleCancel,
        handleSubmit,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting || isGettingDetails
    };
};

/** JSDocs type definitions */

/**
 * GraphQL queries for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountQueries
 *
 * @property {GraphQLAST} customerQuery query to fetch customer details
 * @property {GraphQLAST} getCartDetailsQuery query to get cart details
 */

/**
 * GraphQL mutations for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountMutations
 *
 * @property {GraphQLAST} createAccountMutation mutation for creating new account
 * @property {GraphQLAST} createCartMutation mutation for creating new cart
 * @property {GraphQLAST} mergeCartsMutation mutation for merging carts
 * @property {GraphQLAST} signInMutation mutation for signing
 */

/**
 * Initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} InitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstName first name of the user
 * @property {String} lastName last name of the user
 */

/**
 * Sanitized initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} SanitizedInitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstname first name of the user
 * @property {String} lastname last name of the user
 */

/**
 * Object type returned by the {@link useCreateAccount} talon.
 * It provides props data to use when rendering the create account form component.
 *
 * @typedef {Object} CreateAccountProps
 *
 * @property {Map} errors a map of errors to their respective mutations
 * @property {Function} handleCancel callback function to handle form cancellations
 * @property {Function} handleSubmit callback function to handle form submission
 * @property {SanitizedInitialValues} initialValues initial values for the create account form
 * @property {Boolean} isDisabled true if either details are being fetched or form is being submitted. False otherwise.
 */
