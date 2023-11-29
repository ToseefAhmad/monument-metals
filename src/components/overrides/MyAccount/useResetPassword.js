import { useMutation } from '@apollo/client';
import { useState, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType } from '@app/hooks/useToasts';
import { useToasts } from '@magento/peregrine';

export const useResetPassword = props => {
    const { mutations } = props;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

    const [hasCompleted, setHasCompleted] = useState(false);
    const location = useLocation();
    const [resetPassword, { loading }] = useMutation(mutations.resetPasswordMutation, {
        context: {
            headers: captchaHeaders
        }
    });

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location]);
    const token = searchParams.get('token');

    const handleSubmit = useCallback(
        async ({ email, newPassword }) => {
            try {
                await executeCaptchaValidation('resetPassword');

                if (email && token && newPassword) {
                    await resetPassword({
                        variables: { email, token, newPassword }
                    });

                    setHasCompleted(true);
                    addToast({
                        type: 'info',
                        message: formatMessage({
                            id: 'resetPassword.savedPasswordText',
                            defaultMessage: 'Your new password has been saved.'
                        }),
                        timeout: 5000
                    });
                }
            } catch (error) {
                setHasCompleted(false);
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            }
        },
        [addToast, executeCaptchaValidation, formatMessage, resetPassword, token]
    );

    return {
        hasCompleted,
        loading,
        token,
        handleSubmit
    };
};
