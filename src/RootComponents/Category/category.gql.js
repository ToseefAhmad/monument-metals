import { gql } from '@apollo/client';

export const getCategoryWithChildrensQuery = gql`
    query GetCategoryList($id: Int!) {
        category(id: $id) {
            id
            name
            description
            meta_title
            meta_keywords
            meta_description
            children_count
            display_subcategories_list
            children {
                id
            }
        }
    }
`;
