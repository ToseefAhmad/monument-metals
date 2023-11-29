import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query GetCustomerForLeftNav {
        customer {
            id
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const GET_SCANDIPWA_MENU = gql`
    query GetScandipwaMenu($identifier: String!) {
        scandiwebMenu(identifier: $identifier) {
            menu_id
            items {
                item_id
                title
                url
                parent_id
                icon
                url_type
            }
        }
    }
`;

export default {
    GetCustomerQuery: GET_CUSTOMER,
    GetScandiPwaMenu: GET_SCANDIPWA_MENU
};
