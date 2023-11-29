import { useStoreConfig } from '@app/hooks/useStoreConfig';

export const useShopperApprovedProvider = () => {
    const { storeConfig } = useStoreConfig({
        fields: [
            'shopper_widget_enabled',
            'shopper_widget_account_id',
            'shopper_widget_account_token',
            'shopper_widget_merchant_token',
            'shopper_src_url'
        ]
    });

    return {
        isShopperProvedPopupEnabled: storeConfig?.shopper_widget_enabled,
        shopperApprovedAccountId: storeConfig?.shopper_widget_account_id,
        shopperApprovedAcountToken: storeConfig?.shopper_widget_account_token,
        shopperApprovedMerchantToken: storeConfig?.shopper_widget_merchant_token,
        shopperApprovedSrc: storeConfig?.shopper_src_url
    };
};
