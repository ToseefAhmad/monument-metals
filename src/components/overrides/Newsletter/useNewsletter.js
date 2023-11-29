import { useMutation } from '@apollo/client';
import { useCallback, useRef, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Newsletter/newsletter.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useNewsletter = (props = {}) => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { subscribeMutation } = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const [subscribing, setSubscribing] = useState(false);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const [subscribeNewsLetter, { error: newsLetterError, data }] = useMutation(subscribeMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const handleSubmit = useCallback(
        async ({ email }) => {
            setSubscribing(true);
            try {
                await executeCaptchaValidation('subscribeNewsletter');
                await subscribeNewsLetter({
                    variables: { email }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'newsletter.subscriptionAdded',
                        defaultMessage: 'Thank you for your subscription.'
                    })
                });
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
                return;
            } finally {
                setSubscribing(false);
            }
        },
        [addToast, formatMessage, executeCaptchaValidation, subscribeNewsLetter]
    );

    const errors = useMemo(() => new Map([['subscribeMutation', newsLetterError]]), [newsLetterError]);

    return {
        errors,
        handleSubmit,
        isBusy: subscribing,
        setFormApi,
        newsLetterResponse: data && data.subscribeEmailToNewsletter
    };
};
