import { gql } from '@apollo/client';

import { ShippingInformationFragment } from '../shippingInformationFragments.gql';

export const getCustomerCartAddressQuery = gql`
    query GetCustomerCartAddress {
        customerCart {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;
