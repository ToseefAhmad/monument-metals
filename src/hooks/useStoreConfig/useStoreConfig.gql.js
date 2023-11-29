import { gql } from '@apollo/client';

export const getStoreConfigQuery = (fields = []) => gql`
    query getStoreConfig {
        storeConfig { id ${fields.join(' ')} }
    }
`;
