import { useMutation } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useCallback, useRef, useMemo } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './estimateTax.gql';

const placeholderAddress = {
    firstname: 'firstname',
    lastname: 'lastname',
    city: 'city',
    telephone: 'telephone',
    street: ['street'],
    save_in_address_book: false
};

export const useEstimateTax = ({ fetchCartDetails }) => {
    const [{ cartId }] = useCartContext();

    const { setShippingAddressMutation } = DEFAULT_OPERATIONS;

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [setShippingAddress] = useMutation(setShippingAddressMutation, {
        fetchPolicy: 'no-cache',
        onCompleted: () => {
            fetchCartDetails({ variables: { cartId } });
        }
    });

    const debouncedSetAddress = useMemo(
        () =>
            debounce((country, region, postcode) => {
                const customerRegion = {};
                if (region.region_id) {
                    customerRegion['region_id'] = region.region_id;
                } else if (region.region) {
                    customerRegion['region'] = region.region;
                }

                setShippingAddress({
                    variables: {
                        cartId,
                        address: {
                            country_code: country,
                            postcode: postcode,
                            ...customerRegion,
                            ...placeholderAddress
                        }
                    }
                });
            }, 500),
        [setShippingAddress, cartId]
    );

    const handleFormChanges = useCallback(
        async ({ country, region, postcode }) => {
            formApiRef.current.validate();

            if (!country || !region || !postcode) {
                return;
            }

            debouncedSetAddress(country, region, postcode);
        },
        [formApiRef, debouncedSetAddress]
    );

    return {
        handleFormChanges,
        setFormApi
    };
};
