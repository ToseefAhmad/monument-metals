import { gql } from '@apollo/client';

/* Returns all categories (root and all children) */
export const GET_ALL_CATEGORIES = gql`
    query categoryList {
        categoryList(filters: {}) {
            id
            level
            children {
                id
                level
            }
        }
    }
`;
