import { gql } from '@apollo/client';

export const GET_CAPTCHA_CONFIG_DATA = gql`
    query GetCaptchaConfigData {
        storeConfig {
            id
            captcha_key
            captcha_language
        }
    }
`;
