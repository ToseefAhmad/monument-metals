import { gql } from '@apollo/client';

export const getCheckMoneyConfigQuery = gql`
    query storeConfigData {
        storeConfig {
            id
            store_code
            checkmo_address
            checkmo_pay_to
            checkmo_cc
            checkmo_cc_total
        }
    }
`;

export const saveCheckMoneyOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "checkmo", checkmo: { is_vault: false } } }
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

export const saveCheckMoneyCCOnCartMutation = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
        $token: String!
        $save: Boolean!
        $type: String!
        $number: String!
        $exp: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "checkmo"
                    checkmo: {
                        payment_method_token: $token
                        is_active_payment_token_enabler: $save
                        is_vault: false
                        card_type: $type
                        card_number: $number
                        card_exp: $exp
                    }
                }
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

export const saveCheckMoneyVaultOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $vaultToken: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "checkmo_vault"
                    checkmo_vault: { public_hash: $vaultToken, payment_method_token: $vaultToken, is_vault: true }
                }
            }
        ) {
            cart {
                id
            }
        }
    }
`;
