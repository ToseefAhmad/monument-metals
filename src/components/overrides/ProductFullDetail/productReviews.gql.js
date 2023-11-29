import { gql } from '@apollo/client';

export const SUBMIT_REVIEW = gql`
    mutation createProductReview($sku: String!, $nickname: String!, $summary: String!, $text: String!) {
        createProductReview(input: { sku: $sku, nickname: $nickname, summary: $summary, text: $text, ratings: [] }) {
            review {
                nickname
                summary
                text
            }
        }
    }
`;

export const GET_REVIEWS = gql`
    query getProductReviews($urlKey: String!, $pageSize: Int!, $currentPage: Int!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                review_count
                reviews(pageSize: $pageSize, currentPage: $currentPage) {
                    items {
                        nickname
                        text
                        summary
                    }
                }
            }
        }
    }
`;
