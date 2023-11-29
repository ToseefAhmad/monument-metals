import { gql } from '@apollo/client';

export const getPaymentMethodsQuery = gql`
    query getPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
                title
            }
        }
    }
`;
