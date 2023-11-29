import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { useFormState, useFormApi } from 'informed';
import debounce from 'lodash.debounce';
import { useState, useCallback, useEffect, useMemo } from 'react';

import { useCheckoutProvider } from '../context';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import {
    GET_BILLING_ADDRESS,
    GET_SHIPPING_ADDRESS,
    GET_IS_BILLING_ADDRESS_SAME,
    SET_BILLING_ADDRESS
} from './billingAddress.gql';

/**
 * Maps address response data from GET_BILLING_ADDRESS and GET_SHIPPING_ADDRESS
 * queries to input names in the billing address form.
 * {@link creditCard.gql.js}.
 *
 * @param {ShippingCartAddress|BillingCartAddress} rawAddressData query data
 */
export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const {
            firstName,
            lastName,
            company,
            city,
            postcode,
            phoneNumber,
            street,
            country,
            country_code,
            region
        } = rawAddressData;

        // Specify region_id in case of select or region in case of text input
        const customerRegion = {};
        if (region.code && region.region_id) {
            customerRegion['regionId'] = region.region_id;
        } else if (region.region) {
            customerRegion['region'] = region.region;
        }

        return {
            firstName,
            lastName,
            company,
            city,
            postcode,
            phoneNumber,
            street,
            country: country_code || country.code,
            ...customerRegion
        };
    }

    return {};
};

/**
 * Talon to handle Billing address for payment forms.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Funciton} props.resetShouldSubmit callback to invoke when submit has completed (success or fail)
 * @param {Function} props.onBillingAddressChangedError callback to invoke when an error was thrown while setting the billing address
 * @param {Function} props.onBillingAddressChangedSuccess callback to invoke when address was sucessfully set
 * @param {DocumentNode} props.operations.getShippingAddressQuery query to fetch shipping address from cache
 * @param {DocumentNode} props.operations.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.operations.GET_IS_BILLING_ADDRESS_SAME query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.operations.setBillingAddressMutation mutation to update billing address on the cart
 *
 * @returns {
 *   errors: Map<String, Error>,
 *   isBillingAddressSame: Boolean,
 *   initialValues: {
 *      firstName: String,
 *      lastName: String,
 *      city: String,
 *      postcode: String,
 *      phoneNumber: String,
 *      street1: String,
 *      street2: String,
 *      country: String,
 *      state: String,
 *      isBillingAddressSame: Boolean
 *   },
 *   shippingAddressCountry: String,
 * }
 */
export const useBillingAddress = ({
    resetShouldSubmit,
    shouldSubmit,
    isShippingInformationDone,
    resetBillingAddressDone,
    onBillingAddressChangedError,
    onBillingAddressChangedSuccess
}) => {
    const client = useApolloClient();
    const formState = useFormState();
    const { validate: validateBillingAddressForm, reset: resetBillingAddressForm } = useFormApi();
    const [{ cartId }] = useCartContext();
    const { setIsUpdating } = useCheckoutProvider();

    const { data: shippingAddressData, loading: getShippingAddressLoading } = useQuery(GET_SHIPPING_ADDRESS, {
        skip: !cartId,
        variables: { cartId }
    });

    const { data: isBillingAddressSameData, loading: getIsBillingAddressSameLoading } = useQuery(
        GET_IS_BILLING_ADDRESS_SAME,
        {
            skip: !cartId,
            variables: { cartId }
        }
    );

    const { data: billingAddressData, loading: getBillingAddressLoading } = useQuery(GET_BILLING_ADDRESS, {
        skip: !cartId,
        variables: { cartId }
    });

    const [
        updateBillingAddress,
        {
            error: billingAddressMutationError,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(SET_BILLING_ADDRESS);

    // Disable place order button when any query/mutation is loading
    useEffect(() => {
        if (
            getShippingAddressLoading ||
            getIsBillingAddressSameLoading ||
            getBillingAddressLoading ||
            billingAddressMutationLoading
        ) {
            setIsUpdating(true);
        } else {
            setIsUpdating(false);
        }
    }, [
        billingAddressMutationLoading,
        getBillingAddressLoading,
        getIsBillingAddressSameLoading,
        getShippingAddressLoading,
        setIsUpdating
    ]);

    const shippingAddressCountry =
        shippingAddressData && shippingAddressData.cart.shippingAddresses[0]
            ? shippingAddressData.cart.shippingAddresses[0].country.code
            : DEFAULT_COUNTRY_CODE;
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    const initialValues = useMemo(() => {
        const isBillingAddressSame = isBillingAddressSameData
            ? isBillingAddressSameData.cart.isBillingAddressSame
            : true;

        let billingAddress = {};
        /**
         * If the user wants billing address same as shipping address, do
         * not auto fill the fields.
         */
        if (isBillingAddressSame) {
            return { isBillingAddressSame, ...billingAddress };
        } else if (billingAddressData) {
            // The user does not want the billing address to be the same.
            // Attempt to pre-populate the form if a billing address is already set.
            if (billingAddressData.cart.billingAddress) {
                const {
                    // eslint-disable-next-line no-unused-vars
                    __typename,
                    ...rawBillingAddress
                } = billingAddressData.cart.billingAddress;
                billingAddress = mapAddressData(rawBillingAddress);
            }
        }

        return { isBillingAddressSame, ...billingAddress };
    }, [isBillingAddressSameData, billingAddressData]);

    /**
     * Helpers
     */

    /**
     * This function sets the boolean isBillingAddressSame
     * in cache for future use. We use cache because there
     * is no way to save this on the cart in remote.
     */
    const setIsBillingAddressSameInCache = useCallback(() => {
        client.writeQuery({
            query: GET_IS_BILLING_ADDRESS_SAME,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    isBillingAddressSame
                }
            }
        });
    }, [client, cartId, isBillingAddressSame]);

    /**
     * This function sets the billing address on the cart using the
     * shipping address.
     */
    const setShippingAddressAsBillingAddress = useCallback(() => {
        const shippingAddress =
            shippingAddressData && shippingAddressData.cart.shippingAddresses[0]
                ? mapAddressData(shippingAddressData.cart.shippingAddresses[0])
                : null;

        if (shippingAddress) {
            updateBillingAddress({
                variables: {
                    cartId,
                    ...shippingAddress,
                    sameAsShipping: true
                }
            });
        } else {
            onBillingAddressChangedError();
        }
    }, [shippingAddressData, updateBillingAddress, cartId, onBillingAddressChangedError]);

    /**
     * This function sets the billing address on the cart using the
     * information from the form.
     */
    const setBillingAddress = useCallback(() => {
        const { firstName, lastName, company, country, street, city, region, postcode, phoneNumber } = formState.values;

        updateBillingAddress({
            variables: {
                cartId,
                firstName,
                lastName,
                company,
                country,
                street,
                city,
                region,
                postcode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    /**
     * Handle billing address update
     */
    const handleBillingAddressUpdate = useCallback(() => {
        try {
            // Validate billing address if not the same as shipping before mutation
            if (!isBillingAddressSame) {
                setBillingAddress();
            } else {
                setShippingAddressAsBillingAddress();
            }
            setIsBillingAddressSameInCache();
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            onBillingAddressChangedError();
        }
    }, [
        isBillingAddressSame,
        onBillingAddressChangedError,
        setBillingAddress,
        setIsBillingAddressSameInCache,
        setShippingAddressAsBillingAddress
    ]);

    // Debounced set shipping adddress mutation with 1000ms delay
    const debouncedHandleBillingAddressUpdate = useMemo(
        () =>
            debounce(() => {
                handleBillingAddressUpdate();
            }, 1000),
        [handleBillingAddressUpdate]
    );

    const [isBillingAddressFilled, setIsBillingAddressFilled] = useState(false);

    // Check if billing address required fields are filled, then submit
    useEffect(() => {
        if (!isBillingAddressSame) {
            const { city, country, firstName, lastName, phoneNumber, postcode, region, street } = formState.values;

            if (
                !formState.invalid &&
                city &&
                country &&
                firstName &&
                lastName &&
                phoneNumber &&
                postcode &&
                region &&
                street
            ) {
                setIsUpdating(true);
                debouncedHandleBillingAddressUpdate();
            } else {
                setIsBillingAddressFilled(false);
                resetBillingAddressDone();
            }
        }
    }, [
        debouncedHandleBillingAddressUpdate,
        formState,
        handleBillingAddressUpdate,
        isBillingAddressSame,
        onBillingAddressChangedSuccess,
        resetBillingAddressDone,
        setIsUpdating,
        validateBillingAddressForm
    ]);

    // Submit billing address if all required fields are filled
    useEffect(() => {
        if (isBillingAddressFilled) {
            handleBillingAddressUpdate();
        }
    }, [handleBillingAddressUpdate, isBillingAddressFilled]);

    // Submit if billing address is the same as shipping address and shipping address is done
    useEffect(() => {
        if (isBillingAddressSame && isShippingInformationDone) {
            handleBillingAddressUpdate();
        } else {
            resetBillingAddressDone();
        }
    }, [
        handleBillingAddressUpdate,
        isBillingAddressSame,
        isShippingInformationDone,
        resetBillingAddressDone,
        resetBillingAddressForm
    ]);

    // Submit billing address if place order button clicked and shipping address is done
    useEffect(() => {
        if (shouldSubmit && isShippingInformationDone) {
            handleBillingAddressUpdate();
        }
    }, [handleBillingAddressUpdate, isShippingInformationDone, shouldSubmit]);

    /**
     * Billing address mutation has completed
     */
    useEffect(() => {
        try {
            const billingAddressMutationCompleted = billingAddressMutationCalled && !billingAddressMutationLoading;

            if (billingAddressMutationCompleted && !billingAddressMutationError) {
                resetShouldSubmit();
                onBillingAddressChangedSuccess();
            }

            if (billingAddressMutationCompleted && billingAddressMutationError) {
                /**
                 * Billing address save mutation is not successful.
                 * Reset update button clicked flag.
                 */
                throw new Error('Billing address mutation failed');
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            resetShouldSubmit();
            onBillingAddressChangedError();
        }
    }, [
        billingAddressMutationError,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        resetShouldSubmit
    ]);

    const errors = useMemo(() => new Map([['setBillingAddressMutation', billingAddressMutationError]]), [
        billingAddressMutationError
    ]);

    return {
        errors,
        isBillingAddressSame,
        initialValues,
        shippingAddressCountry
    };
};
