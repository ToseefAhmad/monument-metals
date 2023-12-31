import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import { StoreTitle } from '@app/components/overrides/Head';
import { useResetPassword } from '@app/components/overrides/MyAccount/useResetPassword';
import Password from '@app/components/overrides/Password';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import resetPasswordOperations from '@magento/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql';
import defaultClasses from '@magento/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.module.css';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const talonProps = useResetPassword({ ...resetPasswordOperations });
    const { hasCompleted, loading, token, handleSubmit } = talonProps;
    const PAGE_TITLE = formatMessage({
        id: 'resetPassword.pageTitleText',
        defaultMessage: 'Reset Password'
    });
    const tokenMissing = (
        <div className={classes.invalidTokenContainer}>
            <div className={classes.invalidToken}>
                <FormattedMessage
                    id={'resetPassword.invalidTokenMessage'}
                    defaultMessage={'Uh oh, something went wrong. Check the link or try again.'}
                />
            </div>
        </div>
    );

    const recoverPassword = hasCompleted ? (
        <div className={classes.successMessageContainer}>
            <div className={classes.successMessage}>
                <FormattedMessage
                    id={'resetPassword.successMessage'}
                    defaultMessage={
                        'Your new password has been saved. Please use this password to sign into your Account.'
                    }
                />
            </div>
        </div>
    ) : (
        <Form className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.description}>
                <FormattedMessage
                    id={'resetPassword.descriptionText'}
                    defaultMessage={'Please enter your email address and new password.'}
                />
            </div>
            <Field label={'Email address'}>
                <TextInput field={'email'} validate={isRequired} />
            </Field>
            <Password
                classes={{
                    root: classes.password
                }}
                label={formatMessage({
                    id: 'resetPassword.newPasswordText',
                    defaultMessage: 'New Password'
                })}
                fieldName={'newPassword'}
                isToggleButtonHidden={false}
            />
            <Button className={classes.submitButton} type="submit" priority="high" disabled={loading}>
                <FormattedMessage id="resetPassword.savePassword" defaultMessage="Save Password" />
            </Button>
        </Form>
    );

    return (
        <div className={classes.root}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {token ? recoverPassword : tokenMissing}
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        container: string,
        description: string,
        errorMessage: string,
        heading: string,
        invalidToken: string,
        invalidTokenContainer: string,
        password: string,
        root: string,
        submitButton: string,
        successMessage: string,
        successMessageContainer: string
    })
};
