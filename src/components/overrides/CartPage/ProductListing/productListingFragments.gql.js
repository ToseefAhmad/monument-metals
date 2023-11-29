import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            uid
            product {
                id
                name
                sku
                url_key
                preorder_note
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            small_image {
                                url
                            }
                        }
                    }
                }
                categories {
                    id
                    name
                    breadcrumbs {
                        category_id
                        category_name
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    configurable_product_option_value_uid
                    option_label
                    value_id
                    value_label
                }
            }
        }
        item_errors {
            product_id
            message
        }
    }
`;
