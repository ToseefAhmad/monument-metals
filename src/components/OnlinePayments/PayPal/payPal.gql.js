import { gql } from '@apollo/client';

export const getPayPalConfig = gql`
    query GetPaypalExpressConfig {
        storeConfig {
            id
            paypal_client_id
            paypal_merchant_id
            base_currency
        }
    }
`;

export const createPayPalToken = gql`
    mutation CreatePaypalExpressToken($cartId: String!) {
        createPaypalExpressToken(
            input: {
                cart_id: $cartId
                code: "paypal_express"
                urls: { return_url: "checkout/success", cancel_url: "checkout/error" }
            }
        ) {
            token
        }
    }
`;

export const setPaymentMethodOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $payerId: String!, $token: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: { code: "paypal_express", paypal_express: { payer_id: $payerId, token: $token } }
            }
        ) {
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

export const setPaymentMethodOnCartInitMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "paypal_express" } }) {
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
