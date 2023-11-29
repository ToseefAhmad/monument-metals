import { gql } from '@apollo/client';

export const saveEcheckOnCartMutation = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
        $routingNumber: String!
        $accountNumber: String!
        $accountType: String!
        $save: Boolean!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "echeck"
                    echeck: {
                        routing_number: $routingNumber
                        account_number: $accountNumber
                        account_type: $accountType
                        is_active_payment_token_enabler: $save
                        is_vault: false
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

export const saveVaultOnCartMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $vaultToken: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "echeck_vault"
                    echeck_vault: { public_hash: $vaultToken, payment_method_token: $vaultToken, is_vault: true }
                }
            }
        ) {
            cart {
                id
            }
        }
    }
`;
