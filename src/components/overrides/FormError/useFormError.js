import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

export const useFormError = props => {
    const { errors } = props;
    const { formatMessage } = useIntl();

    const derivedErrorMessage = useMemo(() => {
        const defaultErrorMessage =
            errors.length &&
            formatMessage({
                id: 'formError.errorMessage',
                defaultMessage: 'An error has occurred. Please check the input and try again.'
            });
        return deriveErrorMessage(errors, defaultErrorMessage);
    }, [errors, formatMessage]);

    return {
        errorMessage: derivedErrorMessage
    };
};
