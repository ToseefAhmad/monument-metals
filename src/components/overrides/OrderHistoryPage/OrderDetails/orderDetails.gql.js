import { gql } from '@apollo/client';

export const GET_COUNTRY_BY_ID = gql`
    query getCountryByQuery($country_code: String!) {
        country(id: $country_code) {
            id
            full_name_english
        }
    }
`;

export default {
    getCountryByQuery: GET_COUNTRY_BY_ID
};
