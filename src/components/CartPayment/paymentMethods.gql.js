import { gql } from '@apollo/client';

export const getPaymentMethodsQuery = gql`
    query getPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            available_payment_methods {
                code
                title
                active
                description_title
                dispatch_title
                description
                description_list
                description_size
                payment_fee
                description_title
                dispatch_title
                description_list
                description_size
                active
            }
            selected_payment_method {
                code
            }
        }
    }
`;

export const setPaymentMethodMutation = gql`
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

export const getDefaultPaymentMethodDescriptionQuery = gql`
    query storeConfig {
        storeConfig {
            id
            default_payment_title
            default_payment_description
            default_payment_size
        }
    }
`;
