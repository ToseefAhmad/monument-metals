import { gql } from '@apollo/client';

export const GET_SAME_CATEGORY_PRODUCTS = gql`
    query products($categories: [String!]!) {
        products(filter: { category_id: { in: $categories }, in_stock: { eq: "1" } }) {
            items {
                url_key
                stock_status
            }
        }
    }
`;
