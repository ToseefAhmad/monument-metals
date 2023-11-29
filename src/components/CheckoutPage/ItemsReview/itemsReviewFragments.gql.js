import { gql } from '@apollo/client';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            prices {
                row_total {
                    value
                    currency
                }
            }
            product {
                id
                sku
                name
                stock_status
                categories {
                    id
                    name
                    breadcrumbs {
                        category_id
                        category_name
                    }
                }
                thumbnail {
                    url
                }
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            thumbnail {
                                url
                            }
                        }
                    }
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
