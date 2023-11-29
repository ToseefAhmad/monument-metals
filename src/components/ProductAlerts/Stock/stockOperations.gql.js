import { gql } from '@apollo/client';

export const STOCK_NOTIFY = gql`
    mutation ProductAlertCustomerNotifyStock($sku: String!, $qty: Int!) {
        ProductAlertCustomerNotifyStock(input: { productSku: $sku, qty: $qty }) {
            status
        }
    }
`;

export const STOCK_NOTIFY_GUEST = gql`
    mutation ProductAlertNotifyStock($email: String!, $sku: String!, $qty: Int!) {
        ProductAlertNotifyStock(input: { email: $email, productSku: $sku, qty: $qty }) {
            status
        }
    }
`;

export default {
    mutations: {
        stockNotify: STOCK_NOTIFY,
        stockNotifyGuest: STOCK_NOTIFY_GUEST
    }
};
