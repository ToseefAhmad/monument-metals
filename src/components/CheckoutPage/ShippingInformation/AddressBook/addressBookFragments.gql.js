import { gql } from '@apollo/client';

export const CustomerAddressFragment = gql`
    fragment CustomerAddressFragment on CustomerAddress {
        id
        city
        country_code
        default_shipping
        firstname
        lastname
        company
        postcode
        region {
            region
            region_code
            region_id
        }
        street
        telephone
        default_shipping
    }
`;

export const AddressBookFragment = gql`
    fragment AddressBookFragment on Customer {
        id
        addresses {
            id
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;
