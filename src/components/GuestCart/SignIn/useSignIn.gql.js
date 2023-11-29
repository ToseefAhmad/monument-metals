import { gql } from '@apollo/client';

import { CheckoutPageFragment } from '@app/components/overrides/CheckoutPage/checkoutPageFragments.gql';

export const getCustomerQuery = gql`
    query GetCustomerAfterSignIn {
        customer {
            id
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const signInMutation = gql`
    mutation SignIn($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const createCartMutation = gql`
    mutation CreateCartAfterSignIn {
        cartId: createEmptyCart
    }
`;

export const mergeCartsMutation = gql`
    mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!, $mergeItems: Boolean) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId, merge_items: $mergeItems)
            @connection(key: "mergeCarts") {
            id
            items {
                id
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const getSelectedPaymentMethodQuery = gql`
    query getPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
            }
        }
    }
`;

export const setSelectedPaymentMethodMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $paymentCode: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: $paymentCode } }) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;
