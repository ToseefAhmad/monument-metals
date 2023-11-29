import { gql } from '@apollo/client';

export const PRICE_NOTIFY = gql`
    mutation ProductAlertCustomerNotifyMetalPrice($metalType: Int!, $type: Int!, $price: Float!) {
        ProductAlertCustomerNotifyMetalPrice(input: { metal_type: $metalType, type: $type, metal_price: $price }) {
            status
        }
    }
`;

export default {
    mutations: {
        priceNotify: PRICE_NOTIFY
    }
};
