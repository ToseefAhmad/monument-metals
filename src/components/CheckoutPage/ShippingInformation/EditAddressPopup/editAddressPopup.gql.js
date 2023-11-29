import { gql } from '@apollo/client';

export const updateCustomerAddressMutation = gql`
    mutation UpdateCustomerAddress($addressId: Int!, $address: CustomerAddressInput!) {
        updateCustomerAddress(id: $addressId, input: $address) {
            id
        }
    }
`;
