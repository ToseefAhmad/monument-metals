import { useStoreConfig } from '@app/hooks/useStoreConfig';

export const useNotification = () => {
    const { storeConfig } = useStoreConfig({
        fields: [
            'notification_active',
            'notification_settings_mode',
            'notification_settings_message',
            'notification_settings_link'
        ]
    });

    return {
        notificationActive: storeConfig?.notification_active,
        notificationData: {
            active: storeConfig?.notification_active,
            mode: storeConfig?.notification_settings_mode || 'warning',
            message: storeConfig?.notification_settings_message || '',
            link: storeConfig?.notification_settings_link || ''
        }
    };
};
