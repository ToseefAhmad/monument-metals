import { gql } from '@apollo/client';

export const GET_PAGE_SIZE = gql`
    query getPageSize {
        storeConfig {
            id
            grid_per_page
        }
    }
`;

export const GET_PRODUCT_FILTERS_BY_SEARCH = gql`
    query getProductFiltersBySearch($search: String!) {
        products(search: $search) {
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

export const PRODUCT_SEARCH = gql`
    query ProductSearch(
        $currentPage: Int = 1
        $inputText: String!
        $pageSize: Int = 6
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(currentPage: $currentPage, pageSize: $pageSize, search: $inputText, filter: $filters, sort: $sort) {
            items {
                id
                uid
                name
                categories {
                    id
                    name
                    breadcrumbs {
                        category_id
                        category_name
                    }
                }
                short_description {
                    html
                }
                preorder_note
                price_range {
                    maximum_price {
                        final_price {
                            currency
                            value
                        }
                        fee_price {
                            currency
                            value
                        }
                    }
                }
                price_tiers {
                    final_price {
                        currency
                        value
                    }
                    fee_price {
                        currency
                        value
                    }
                    quantity
                }
                sku
                small_image {
                    url
                }
                stock_status
                type_id
                url_key
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForSearch {
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
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getPageSize: GET_PAGE_SIZE,
    getProductFiltersBySearchQuery: GET_PRODUCT_FILTERS_BY_SEARCH,
    productSearchQuery: PRODUCT_SEARCH
};
