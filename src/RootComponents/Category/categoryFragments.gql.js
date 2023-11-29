import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        id
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
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
`;
