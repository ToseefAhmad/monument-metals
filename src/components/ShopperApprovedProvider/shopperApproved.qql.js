import { gql } from '@apollo/client';

export const Get_Shooper_Approved_Config_Data = gql`
    query GetShooperApprovedConfigData {
        storeConfig {
            shopper_widget_enabled
            shopper_widget_account_id
            shopper_widget_account_token
            shopper_widget_merchant_token
            shopper_src_url
        }
    }
`;
