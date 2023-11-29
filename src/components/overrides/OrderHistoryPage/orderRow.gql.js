import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            id
            configurable_thumbnail_source
        }
    }
`;

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query GetProductThumbnailsByURLKey($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            items {
                id
                sku
                name
                thumbnail {
                    label
                    url
                }
                stock_status
                url_key
                ... on ConfigurableProduct {
                    variants {
                        product {
                            sku
                            id
                            thumbnail {
                                label
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const REORDER_ITEMS = gql`
    mutation ReorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const GET_ORDER_PDF = gql`
    query getOrderPdfUrl($order_id: String!) {
        getOrderPdfUrl(order_id: $order_id) {
            pdf_order_url
        }
    }
`;

export default {
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    reorderItems: REORDER_ITEMS,
    getOrderPdfUrl: GET_ORDER_PDF
};
