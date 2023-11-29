import { gql } from '@apollo/client';

export const getCartTotalQuery = gql`
    query GetCartTotals($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            prices {
                grand_total {
                    value
                    currency
                }
            }
        }
    }
`;
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
