import { gql } from '@apollo/client';

import { DELETE_ALERT } from './alertInformation.gql';

export const GET_STOCK_ALERTS = gql`
    query getAlerts($pageSize: Int!) {
        customer {
            mp_product_alert {
                out_of_stock(pageSize: $pageSize) {
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
                        qty
                        product_data {
                            name
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
