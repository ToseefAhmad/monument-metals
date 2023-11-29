import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_id: $categoryIdFilter }) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
            }
        }
    }
`;

export const GET_PAGE_SIZE = gql`
    query getPageSize {
        storeConfig {
            id
            grid_per_page
        }
    }
`;

export const GET_CATEGORY_LIST = gql`
    query GetCategoryList($id: Int!) {
        category(id: $id) {
            id
            in_stock_category
            in_stock_connected_category_id
            children {
                id
                children {
                    id
                }
            }
        }
    }
`;

export const GET_CATEGORY = gql`
    query GetCategories(
        $id: Int!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        category(id: $id) {
            id
            ...CategoryFragment
        }
        products(pageSize: $pageSize, currentPage: $currentPage, filter: $filters, sort: $sort) {
            ...ProductsFragment
        }
    }
    ${CategoryFragment}
    ${ProductsFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export default {
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getPageSizeQuery: GET_PAGE_SIZE,
    getCategoryQuery: GET_CATEGORY,
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getCategoryListQuery: GET_CATEGORY_LIST
};
