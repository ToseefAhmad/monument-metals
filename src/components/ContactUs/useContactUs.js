import { useMutation } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType, useToasts } from '@app/hooks/useToasts';

import { CONTACT_US } from './contactUs.gql';

export const useContactUs = () => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [isContacting, setIsContacting] = useState(false);

    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

    const [contactUsMutation] = useMutation(CONTACT_US, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ name, email, phone, message }) => {
            setIsContacting(true);
            try {
                await executeCaptchaValidation('contactUs');
                await contactUsMutation({
                    variables: { name, email, phone, message }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'contactUs.contactSuccess',
                        defaultMessage: 'Thank you for Contacting with us, we will get back to you soon.'
                    })
                });
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            } finally {
                setIsContacting(false);
            }
        },
        [addToast, contactUsMutation, executeCaptchaValidation, formatMessage]
    );

    return {
        handleSubmit,
        isBusy: isContacting,
        setFormApi
    };
};
