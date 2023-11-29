import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

import { useCheckoutProvider } from '../../context';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { getCustomerQuery, setShippingAddressOnCartMutation } from './addressForm.gql.js';

export const useAddressForm = ({
    onSuccess,
    resetSuccess,
    shippingData,
    shouldSubmit,
    resetShouldSubmit,
    onError,
    showInitialData
}) => {
    const { setIsUpdating, setShippingAddressCountryCode } = useCheckoutProvider();
    const [{ cartId }] = useCartContext();

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const formState = formApiRef && formApiRef.current && formApiRef.current.getState();

    const { data: customerData, loading: getCustomerLoading } = useQuery(getCustomerQuery);
    const [setShippingAddressOnCart] = useMutation(setShippingAddressOnCartMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    // Set initial values for the form from custmer data
    const { country } = shippingData;
    const { code: countryCode } = country;

    let initialValues = showInitialData
        ? {
              ...shippingData,
              country: countryCode
          }
        : {
              country: countryCode
          };

    if (!getCustomerLoading) {
        const { customer } = customerData;
        const { email, firstname, lastname } = customer;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    // Validate shipping address form
    const validateForm = useCallback(() => {
        formApiRef && formApiRef.current && formApiRef.current.validate();

        if (formState && !!Object.keys(formState.errors).length) {
            onError();
            resetShouldSubmit();
            resetSuccess();

            return false;
        }

        return true;
    }, [formState, onError, resetShouldSubmit, resetSuccess]);

    // Set shipping address on cart mutation and refetch shipping methods information
    const setShippingAddress = useCallback(
        async customerAddress => {
            try {
                await setShippingAddressOnCart({
                    variables: {
                        input: {
                            cart_id: cartId,
                            shipping_addresses: [
                                {
                                    address: customerAddress
                                }
                            ]
                        }
                    }
                });
            } catch (e) {
                console.error(e.message);
            }
            setIsUpdating(false);
        },
        [cartId, setIsUpdating, setShippingAddressOnCart]
    );

    // Debounced set shipping adddress mutation with 1000ms delay
    const debouncedSetShippingAddress = useMemo(
        () =>
            debounce(customerAddress => {
                setShippingAddress(customerAddress);
            }, 1000),
        [setShippingAddress]
    );

    // On any value change in the shipping address form
    const [isRequiredValuesFilled, setIsRequiredValuesFilled] = useState(false);
    const handleValueChange = useCallback(
        formValues => {
            const {
                email,
                firstname,
                lastname,
                company,
                country,
                city,
                street,
                region,
                postcode,
                telephone
            } = formValues;

            // Invisible validation for required fields to not output any errors on first input by customers
            if (!isRequiredValuesFilled) {
                const isRequired =
                    email && firstname && lastname && country && city && street && region && postcode && telephone;

                if (isRequired) {
                    setIsRequiredValuesFilled(true);
                } else {
                    return null;
                }
            }

            // Validate shipping address form on change now and throw validation errors
            if (!validateForm()) {
                return;
            }

            // Specify region_id in case of select or region in case of text input
            const customerRegion = {};
            if (region.region_id) {
                customerRegion['region_id'] = region.region_id;
            } else if (region.region) {
                customerRegion['region'] = region.region;
            }

            // Run set customer address on cart mutation
            const customerAddress = {
                postcode,
                city,
                firstname,
                lastname,
                company: company ? company : '',
                telephone,
                ...customerRegion,
                street,
                country_code: country
            };

            resetSuccess();
            setIsUpdating(true);
            debouncedSetShippingAddress(customerAddress);
        },
        [debouncedSetShippingAddress, isRequiredValuesFilled, resetSuccess, setIsUpdating, validateForm]
    );

    // On country select change - set the country code in checkout context state
    const handleCountryChange = useCallback(
        value => {
            if (value) {
                setShippingAddressCountryCode(value);
            }
        },
        [setShippingAddressCountryCode]
    );

    // Set the country code in checkout context state (it doesn't trigger on form error, so the func above is required)
    useEffect(() => {
        if (formState && formState.values.country) {
            // Doesn't trigger set state if nothing changed
            setShippingAddressCountryCode(currentCountryCode =>
                currentCountryCode === formState.values.country ? currentCountryCode : formState.values.country
            );
        }
    }, [formState, setShippingAddressCountryCode]);

    // Manually trigger handle shipping address form function to send initial shipping address values on component load
    useEffect(() => {
        if (initialValues) {
            handleValueChange(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Validate shipping form when place order button is clicked
    useEffect(() => {
        if (shouldSubmit) {
            validateForm();
        }
    }, [shouldSubmit, validateForm]);

    return {
        handleValueChange,
        initialValues,
        isLoading: getCustomerLoading,
        setFormApi,
        handleCountryChange
    };
};
