import { gql } from '@apollo/client';

export const getNotificationConfigQuery = gql`
    query storeConfigData {
        storeConfig {
            id
            notification_active
            notification_settings_mode
            notification_settings_message
            notification_settings_link
        }
    }
`;
