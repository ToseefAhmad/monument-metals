import { gql } from '@apollo/client';

import { UpsellProductsFragment } from '@app/components/UpsellProducts';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            product_url_suffix
        }
    }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                ...ProductDetailsFragment
                ...UpsellProductsFragment
            }
        }
    }
    ${ProductDetailsFragment}
    ${UpsellProductsFragment}
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
