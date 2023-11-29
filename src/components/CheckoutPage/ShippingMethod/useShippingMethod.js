import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { getSelectedAndAvailableShippingMethodsQuery, setShippingMethodMutation } from './shippingMethod.gql';

const serializeShippingMethod = method => {
    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
};

// Sorts available shipping methods by price.
const byPrice = (a, b) => a.amount.value - b.amount.value;

// Adds a serialized property to shipping method objects
// So they can be selected in the radio group.
const addSerializedProperty = shippingMethod => {
    if (!shippingMethod) return shippingMethod;
    const serializedValue = serializeShippingMethod(shippingMethod);

    return {
        ...shippingMethod,
        serializedValue
    };
};

const DEFAULT_SHIPPING_ADDRESS_COUNTRY_CODE = 'US';
const DEFAULT_SELECTED_SHIPPING_METHOD = {};
const DEFAULT_AVAILABLE_SHIPPING_METHODS = [];

export const useShippingMethod = ({ onSave, setPageIsUpdating, shouldSubmit }) => {
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const { shippingAddressCountryCode, setIsAvailableShippingMethods } = useCheckoutProvider();

    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const formState = formApiRef && formApiRef.current && formApiRef.current.getState();

    const [setShippingMethodCall, { loading: isSettingShippingMethod }] = useMutation(setShippingMethodMutation, {
        onCompleted: () => {
            onSave();
        }
    });

    const { data, loading: isLoadingShippingMethods, refetch } = useQuery(getSelectedAndAvailableShippingMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId,
            countryCode: shippingAddressCountryCode || DEFAULT_SHIPPING_ADDRESS_COUNTRY_CODE
        }
    });

    // Refetch get shipping methods when the country code is changed
    useEffect(() => {
        if (shippingAddressCountryCode && refetch) {
            refetch();
        }
    }, [refetch, shippingAddressCountryCode]);

    // Get available shipping methods list
    const availableShippingMethods = data && data.cart.available_shipping_methods;

    // Set state if there is available shipping methods in the context (to disable place order button if no shipping methods available)
    useEffect(() => {
        const isAvailableShippingMethods = !!availableShippingMethods && !!availableShippingMethods.length;

        setIsAvailableShippingMethods(isAvailableShippingMethods);
    }, [availableShippingMethods, setIsAvailableShippingMethods]);

    // Get selected shipping method from saved data in cart
    const derivedPrimaryShippingAddress =
        data && data.cart.shipping_addresses && data.cart.shipping_addresses.length
            ? data.cart.shipping_addresses[0]
            : null;
    const derivedSelectedShippingMethod =
        derivedPrimaryShippingAddress && availableShippingMethods
            ? addSerializedProperty(derivedPrimaryShippingAddress.selected_shipping_method)
            : DEFAULT_SELECTED_SHIPPING_METHOD;

    // Prepare available shipping methods data from query
    const derivedShippingMethods = useMemo(() => {
        if (!availableShippingMethods) return DEFAULT_AVAILABLE_SHIPPING_METHODS;

        // Shape the list of available shipping methods.
        // Sort them by price and add a serialized property to each.
        const shippingMethodsByPrice = [...availableShippingMethods].sort(byPrice);
        const result = shippingMethodsByPrice.map(addSerializedProperty);

        return result;
    }, [availableShippingMethods]);

    // Mutation to set shipping method
    const setCustomerAddress = useCallback(
        async (carrierCode, methodCode) => {
            try {
                await setShippingMethodCall({
                    variables: {
                        cartId,
                        countryCode: shippingAddressCountryCode,
                        shippingMethod: {
                            carrier_code: carrierCode,
                            method_code: methodCode
                        }
                    }
                });
            } catch {
                return;
            }
            setPageIsUpdating(false);
        },
        [cartId, setPageIsUpdating, setShippingMethodCall, shippingAddressCountryCode]
    );

    // Debounced set shipping method mutation with 1000ms delay
    const debouncedSetShippingMethod = useMemo(
        () =>
            debounce((carrierCode, methodCode) => {
                setCustomerAddress(carrierCode, methodCode);
            }, 1000),
        [setCustomerAddress]
    );

    // Triggers on shipping method radio button change
    const handleSubmit = useCallback(
        async value => {
            const currentShippingMethod = value.shipping_method ? value.shipping_method : value;
            setSelectedShippingMethod(currentShippingMethod);

            if (!shouldSubmit || !currentShippingMethod) {
                return;
            }

            setPageIsUpdating(true);
            const [carrierCode, methodCode] = deserializeShippingMethod(currentShippingMethod);
            debouncedSetShippingMethod(carrierCode, methodCode);
        },
        [shouldSubmit, setPageIsUpdating, debouncedSetShippingMethod]
    );

    // Manually submit shipping method when shipping information (shipping address) is done
    useEffect(() => {
        if (shouldSubmit) {
            if (selectedShippingMethod) {
                handleSubmit(selectedShippingMethod);
            } else if (formState && formState.values) {
                handleSubmit(formState.values);
            }
        }
    }, [formState, handleSubmit, selectedShippingMethod, shouldSubmit]);

    // Set updating when running set shipping method mutation
    useEffect(() => {
        setPageIsUpdating(isSettingShippingMethod);
    }, [isSettingShippingMethod, setPageIsUpdating]);

    // If an authenticated user does not have a preferred shipping method,
    // Auto-select the least expensive one for them.
    useEffect(() => {
        // also check if country isn't set- we don't want to set method if shipping country isn't provided
        if (!data || !cartId || !isSignedIn || !shippingAddressCountryCode) return;

        if (!derivedSelectedShippingMethod && shouldSubmit) {
            // The shipping methods are sorted by price.
            const leastExpensiveShippingMethod = derivedShippingMethods[0];

            if (leastExpensiveShippingMethod) {
                const { carrier_code, method_code } = leastExpensiveShippingMethod;

                setShippingMethodCall({
                    variables: {
                        cartId,
                        countryCode: shippingAddressCountryCode,
                        shippingMethod: {
                            carrier_code,
                            method_code
                        }
                    }
                });
            }
        } else if (derivedSelectedShippingMethod) {
            onSave();
        }
    }, [
        cartId,
        data,
        derivedSelectedShippingMethod,
        isSignedIn,
        setShippingMethodCall,
        derivedShippingMethods,
        shouldSubmit,
        shippingAddressCountryCode,
        onSave
    ]);

    return {
        handleSubmit,
        isLoading: isLoadingShippingMethods,
        selectedShippingMethod: derivedSelectedShippingMethod,
        shippingMethods: derivedShippingMethods,
        setFormApi
    };
};
