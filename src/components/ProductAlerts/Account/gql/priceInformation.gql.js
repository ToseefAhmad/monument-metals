import { gql } from '@apollo/client';

import { DELETE_ALERT } from './alertInformation.gql';

export const GET_STOCK_ALERTS = gql`
    query getAlerts($pageSize: Int!) {
        customer {
            mp_product_alert {
                product_price(pageSize: $pageSize) {
                    total_count
                    pageInfo {
                        pageSize
                        currentPage
                        hasNextPage
                        hasPreviousPage
                        startPage
                        endPage
                    }
                    items {
                        subscriber_id
                        status
                        subscribe_created_at
                        price_type
                        old_price
                        currency
                        product_data {
                            sku
                            product_url
                        }
                    }
                }
            }
        }
    }
`;

export default {
    mutations: {
        deleteAlertMutation: DELETE_ALERT
    },
    queries: {
        getAlertsQuery: GET_STOCK_ALERTS
    }
};
