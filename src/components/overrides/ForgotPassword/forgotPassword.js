import { func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';
import { useStyle } from '@magento/venia-ui/lib/classify';
import forgotPasswordOperations from '@magento/venia-ui/lib/components/ForgotPassword/forgotPassword.gql';
import defaultClasses from '@magento/venia-ui/lib/components/ForgotPassword/forgotPassword.module.css';
import ForgotPasswordForm from '@magento/venia-ui/lib/components/ForgotPassword/ForgotPasswordForm';
import FormSubmissionSuccessful from '@magento/venia-ui/lib/components/ForgotPassword/FormSubmissionSuccessful';

const ForgotPassword = props => {
    const { initialValues, onCancel } = props;

    const { formatMessage } = useIntl();
    const talonProps = useForgotPassword({
        onCancel,
        ...forgotPasswordOperations
    });

    const { forgotPasswordEmail, handleCancel, handleFormSubmit, hasCompleted, isResettingPassword } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const INSTRUCTIONS = formatMessage({
        id: 'forgotPassword.instructions',
        defaultMessage: 'Please enter the email address associated with this account.'
    });
    const children = hasCompleted ? (
        <FormSubmissionSuccessful email={forgotPasswordEmail} />
    ) : (
        <Fragment>
            <h2 className={classes.title}>
                <FormattedMessage id={'forgotPassword.recoverPasswordText'} defaultMessage={'Recover Password'} />
            </h2>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                isResettingPassword={isResettingPassword}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
            />
        </Fragment>
    );

    return <div className={classes.root}>{children}</div>;
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {}
};
