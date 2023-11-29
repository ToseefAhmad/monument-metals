import { useStoreConfig } from '@app/hooks/useStoreConfig';

export const useCaptchaProvider = () => {
    const { storeConfig } = useStoreConfig({
        fields: ['captcha_key', 'captcha_language']
    });

    const captchaKey = storeConfig?.captcha_key;
    const captchaLanguage = storeConfig?.captcha_language;

    return {
        captchaKey,
        captchaLanguage
    };
};
