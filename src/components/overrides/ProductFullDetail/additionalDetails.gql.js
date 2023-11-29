import { gql } from '@apollo/client';

export const GET_ADDITIONAL_PRODCT_DETAILS = gql`
    query productAttributes($id: Int) {
        productAttributes(id: $id) {
            attribute_name
            attribute_value
        }
    }
`;
