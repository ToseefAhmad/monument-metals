import { gql } from '@apollo/client';

export const UpsellProductsFragment = gql`
    fragment UpsellProductsFragment on ProductInterface {
        upsell_products {
            id
            uid
            sku
            name
            url_key
            small_image {
                label
                url
            }
            price_range {
                maximum_price {
                    final_price {
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
                quantity
            }
            categories {
                id
                uid
                name
                breadcrumbs {
                    category_id
                    category_name
                }
            }
        }
    }
`;
