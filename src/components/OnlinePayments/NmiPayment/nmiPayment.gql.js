import { gql } from '@apollo/client';

export const getNmiPaymentConfigQuery = gql`
    query storeConfigData {
        storeConfig {
            id
            store_code
            nmi_tokenization_key
            nmi_collectjs_url
        }
    }
`;

export const SavedPaymentsFragment = gql`
    fragment SavedPaymentsFragment on CustomerPaymentTokens {
        items {
            details
            public_hash
            payment_method_code
        }
    }
`;

export const getSavedPaymentsQuery = gql`
    query GetSavedPayments {
        customerPaymentTokens {
            ...SavedPaymentsFragment
        }
    }
    ${SavedPaymentsFragment}
`;

export const saveCcOnCartMutation = gql`
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
                    code: "aw_nmi"
                    aw_nmi: {
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

export const saveVaultOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $vaultToken: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "aw_nmi_cc_vault"
                    aw_nmi_cc_vault: { public_hash: $vaultToken, payment_method_token: $vaultToken, is_vault: true }
                }
            }
        ) {
            cart {
                id
            }
        }
    }
`;
