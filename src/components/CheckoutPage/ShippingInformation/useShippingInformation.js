import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState, useCallback } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { MOCKED_ADDRESS } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import {
    setCustomerAddressOnCartMutation,
    getDefaultShippingQuery,
    getShippingInformationQuery,
    getCustomerAddressesQuery
} from './shippingInformation.gql';

export const useShippingInformation = ({ onSuccess, resetSuccess }) => {
    const [{ cartId }] = useCartContext();

    const { data: shippingInformationData, loading: getShippingInformationLoading } = useQuery(
        getShippingInformationQuery,
        {
            skip: !cartId,
            variables: {
                cartId
            }
        }
    );
    const { data: customerAddressesData, loading: customerAddressesLoading } = useQuery(getCustomerAddressesQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { data: defaultShippingData, loading: getDefaultShippingLoading } = useQuery(getDefaultShippingQuery, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first'
    });
    const [setDefaultAddressOnCart, { loading: setDefaultAddressLoading }] = useMutation(
        setCustomerAddressOnCartMutation,
        {
            onCompleted: () => {
                onSuccess();
            }
        }
    );

    const customerAddresses = useMemo(() => (customerAddressesData && customerAddressesData.customer.addresses) || [], [
        customerAddressesData
    ]);

    const hasSavedAddress = !!customerAddresses && !!customerAddresses.length;

    const isLoading =
        getShippingInformationLoading ||
        getDefaultShippingLoading ||
        setDefaultAddressLoading ||
        customerAddressesLoading;

    const shippingData = useMemo(() => {
        let filteredData;
        if (shippingInformationData) {
            const { cart } = shippingInformationData;
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = { ...shippingAddresses[0] };
                for (const field in MOCKED_ADDRESS) {
                    if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                        primaryAddress[field] = '';
                    }

                    if (field === 'street' && primaryAddress[field][0] === MOCKED_ADDRESS[field][0]) {
                        primaryAddress[field] = [''];
                    }
                }

                const { region_id, label: region, code: region_code } = primaryAddress.region;

                primaryAddress.region = {
                    region_code,
                    region_id,
                    region
                };

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [shippingInformationData]);

    // Set default shipping address if exists
    const [defaultAddressId, setDefaultAddressId] = useState(null);
    useEffect(() => {
        if (shippingInformationData && !defaultAddressId && cartId && defaultShippingData && customerAddresses) {
            const { customer } = defaultShippingData;
            const { default_shipping: customerDefaultAddressId } = customer;

            // Use customer default address ID or set first shipping address to default in cart instead
            const defaultAddressId = customerDefaultAddressId
                ? customerDefaultAddressId
                : customerAddresses[0]
                ? customerAddresses[0].id
                : null;
            if (defaultAddressId) {
                setDefaultAddressOnCart({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
                setDefaultAddressId(defaultAddressId);
            }
        }
    }, [
        cartId,
        customerAddresses,
        customerAddressesData,
        defaultAddressId,
        defaultShippingData,
        setDefaultAddressId,
        setDefaultAddressOnCart,
        shippingInformationData
    ]);

    // Show address book or address form depends on which button is clicked
    const [isAddNewAddress, setIsAddNewAddress] = useState(false);

    const handleAddNewAddress = useCallback(() => {
        setIsAddNewAddress(true);
        resetSuccess();
    }, [resetSuccess]);

    const [submitSavedAddress, setSubmitSavedAddress] = useState(null);
    const handleSavedAddress = useCallback(() => {
        setIsAddNewAddress(false);
        resetSuccess();
        setSubmitSavedAddress(defaultAddressId);
    }, [defaultAddressId, resetSuccess]);

    return {
        isLoading,
        shippingData,
        hasSavedAddress,
        customerAddresses,
        handleAddNewAddress,
        handleSavedAddress,
        isAddNewAddress,
        submitSavedAddress,
        customerAddressesLoading
    };
};
