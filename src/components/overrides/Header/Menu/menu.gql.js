import { gql } from '@apollo/client';

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
            }
        }
    }
`;
