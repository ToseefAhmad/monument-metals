import { gql } from '@apollo/client';

import { DELETE_ALERT } from './alertInformation.gql';

export const GET_METAL_ALERTS = gql`
    query getAlerts($pageSize: Int!) {
        customer {
            mp_product_alert {
                metal_price(pageSize: $pageSize) {
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
                        metal_type
                        price_type
                        metal_price
                        currency
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
        getAlertsQuery: GET_METAL_ALERTS
    }
};
