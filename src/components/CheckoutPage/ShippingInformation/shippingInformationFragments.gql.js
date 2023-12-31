import { gql } from '@apollo/client';

export const ShippingInformationFragment = gql`
    fragment ShippingInformationFragment on Cart {
        id
        email
        shipping_addresses {
            customer_address_id
            city
            country {
                code
                label
            }
            firstname
            lastname
            postcode
            region {
                code
                label
                region_id
            }
            street
            telephone
        }
    }
`;
