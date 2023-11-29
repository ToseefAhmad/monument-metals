import { gql } from '@apollo/client';

export const getCountryNameQuery = gql`
    query getCountryName($country_code: String!) {
        country(id: $country_code) {
            id
            full_name_locale
        }
    }
`;
