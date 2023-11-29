import { gql } from '@apollo/client';

export const SET_SHIPPING_ADDRESS_ON_CART = gql`
    mutation setShippingAddressesOnCart($cartId: String!, $address: CartAddressInput!) {
        setShippingAddressesOnCart(input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }) {
            cart {
                id
            }
        }
    }
`;

export default {
    setShippingAddressMutation: SET_SHIPPING_ADDRESS_ON_CART
};
