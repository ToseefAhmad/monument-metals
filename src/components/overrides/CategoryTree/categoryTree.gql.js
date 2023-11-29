import { gql } from '@apollo/client';

export const GetCategoryUrlSuffix = gql`
    query GetStoreConfigForCategoryTree {
        storeConfig {
            id
            category_url_suffix
        }
    }
`;
