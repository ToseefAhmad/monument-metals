import { gql } from '@apollo/client';

export const getBankTransferConfigQuery = gql`
    query storeConfigData {
        storeConfig {
            id
            store_code
            bank_transfer_instructions
            bank_transfer_cc
            bank_transfer_cc_total
        }
    }
`;

export const saveBankTransferOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "banktransfer", banktransfer: { is_vault: false } } }
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

export const saveBankTransferCCOnCartMutation = gql`
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
                    code: "banktransfer"
                    banktransfer: {
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

export const saveBankTransferVaultOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $vaultToken: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "banktransfer_vault"
                    banktransfer_vault: { public_hash: $vaultToken, payment_method_token: $vaultToken, is_vault: true }
                }
            }
        ) {
            cart {
                id
            }
        }
    }
`;
