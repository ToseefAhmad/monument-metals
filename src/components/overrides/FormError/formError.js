import { arrayOf, bool, instanceOf, shape, string } from 'prop-types';
import React, { useRef } from 'react';

import { useScrollIntoView } from '@magento/peregrine/lib/hooks/useScrollIntoView';
import { useFormError } from '@magento/peregrine/lib/talons/FormError/useFormError';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ErrorMessage from '@magento/venia-ui/lib/components/ErrorMessage';

const FormError = props => {
    const { classes: propClasses, errors, scrollOnError } = props;

    const talonProps = useFormError({ errors });
    const { errorMessage } = talonProps;
    const errorRef = useRef(null);

    useScrollIntoView(errorRef, scrollOnError && errorMessage);

    const classes = useStyle(propClasses);

    return errorMessage ? (
        <ErrorMessage classes={classes} ref={errorRef}>
            {errorMessage}
        </ErrorMessage>
    ) : null;
};

export default FormError;

FormError.propTypes = {
    classes: shape({
        root: string,
        errorMessage: string
    }),
    errors: arrayOf(instanceOf(Error)),
    scrollOnError: bool
};

FormError.defaultProps = {
    scrollOnError: true
};
