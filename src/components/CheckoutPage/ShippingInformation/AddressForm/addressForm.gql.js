import { gql } from '@apollo/client';

export const getCustomerQuery = gql`
    query GetCustomer {
        customer {
            id
            default_shipping
            email
            firstname
            lastname
        }
    }
`;

export const setShippingAddressOnCartMutation = gql`
    mutation SetShippingAddressesOnCart($input: SetShippingAddressesOnCartInput) {
        setShippingAddressesOnCart(input: $input) {
            cart {
                id
            }
        }
    }
`;
