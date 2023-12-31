import { gql } from '@apollo/client';

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!) {
        route(url: $url) {
            relative_url
            redirect_code
            type
            ... on CmsPage {
                identifier
            }
            ... on ProductInterface {
                id
                __typename
            }
            ... on CategoryInterface {
                id
                children_count
                display_subcategories_list
            }
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
