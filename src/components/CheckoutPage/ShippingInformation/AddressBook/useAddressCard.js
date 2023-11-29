import { useQuery } from '@apollo/client';
import { useCallback, useEffect } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';

import { getCountryNameQuery } from './addressCard.gql';

export const useAddressCard = ({ address, onSelection, isSelected }) => {
    const { setShippingAddressCountryCode } = useCheckoutProvider();
    const addressId = address ? address.id : null;
    const { data: countryData } = useQuery(getCountryNameQuery, {
        skip: !addressId,
        variables: {
            country_code: address.country_code
        }
    });

    const countryName = countryData && countryData.country.full_name_locale;

    const handleClick = useCallback(() => {
        onSelection(addressId);
    }, [addressId, onSelection]);

    const handleKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
                onSelection(addressId);
            }
        },
        [addressId, onSelection]
    );

    useEffect(() => {
        if (isSelected) {
            setShippingAddressCountryCode(address.country_code);
        }
    });

    return {
        handleClick,
        handleKeyPress,
        countryName
    };
};
