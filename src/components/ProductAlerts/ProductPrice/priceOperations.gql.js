import { gql } from '@apollo/client';

export const PRICE_NOTIFY = gql`
    mutation ProductAlertCustomerNotifyPrice($sku: String!, $type: Int!, $price: Float!) {
        ProductAlertCustomerNotifyPrice(input: { productSku: $sku, type: $type, price: $price }) {
            status
        }
    }
`;

export default {
    mutations: {
        priceNotify: PRICE_NOTIFY
    }
};
