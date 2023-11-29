import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState, useMemo } from 'react';

import { setCustomerAddressOnCartMutation } from '../shippingInformation.gql';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { getCustomerCartAddressQuery } from './addressBook.gql';

export const useAddressBook = ({ customerAddresses, onAddNewAddress, submitSavedAddress, onSuccess, resetSuccess }) => {
    const [{ cartId }] = useCartContext();
    const { isUpdating, setIsUpdating } = useCheckoutProvider();
    const [selectedAddress, setSelectedAddress] = useState();

    const [setCustomerAddressOnCart, { error: setCustomerAddressOnCartError }] = useMutation(
        setCustomerAddressOnCartMutation,
        {
            onCompleted: () => {
                onSuccess();
            }
        }
    );
    const { data: customerCartAddressData } = useQuery(getCustomerCartAddressQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const handleAddAddress = useCallback(() => {
        onAddNewAddress();
    }, [onAddNewAddress]);

    // Mutation to set shipping address on cart
    const setCustomerAddress = useCallback(
        async addressId => {
            try {
                await setCustomerAddressOnCart({
                    variables: {
                        cartId,
                        addressId: addressId
                    }
                });
            } catch {
                return;
            }
            setIsUpdating(false);
        },
        [cartId, setCustomerAddressOnCart, setIsUpdating]
    );

    // Debounced set shipping adddress mutation with 1000ms delay
    const debouncedSetCustomerAddress = useMemo(
        () =>
            debounce(addressId => {
                setCustomerAddress(addressId);
            }, 1000),
        [setCustomerAddress]
    );

    // Select shipping address on address card change
    const handleSelectAddress = useCallback(
        addressId => {
            resetSuccess();
            setIsUpdating(true);
            setSelectedAddress(addressId);
            debouncedSetCustomerAddress(addressId);
        },
        [debouncedSetCustomerAddress, resetSuccess, setIsUpdating]
    );

    useEffect(() => {
        if (submitSavedAddress) {
            const addressId = selectedAddress ? selectedAddress : submitSavedAddress;
            setIsUpdating(true);
            debouncedSetCustomerAddress(addressId);
        }
    }, [debouncedSetCustomerAddress, selectedAddress, setIsUpdating, submitSavedAddress]);

    // GraphQL doesn't return which customer address is selected, so perform
    // A simple search to initialize this selected address value.
    if (customerAddresses.length && customerCartAddressData && !selectedAddress) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress => customerAddress.id.toString() === primaryCartAddress.customer_address_id
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
            }
        }
    }

    // Error message from mutation
    const derivedErrorMessage = useMemo(() => deriveErrorMessage([setCustomerAddressOnCartError]), [
        setCustomerAddressOnCartError
    ]);

    return {
        errorMessage: derivedErrorMessage,
        handleAddAddress,
        handleSelectAddress,
        selectedAddress,
        isUpdating
    };
};
