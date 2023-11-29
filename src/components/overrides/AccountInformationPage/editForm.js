import { shape, string, func, bool, any } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField
} from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './editForm.module.css';

const EditForm = props => {
    const {
        classes: propClasses,
        handleChangePassword,
        shouldShowNewPassword,
        customer,
        showPassword,
        setShowPassword
    } = props;
    const { formatMessage } = useIntl();
    const { email } = customer;

    const initialEmail = email;

    const currentEmail = useFieldState('email');

    const showPasswordField = currentEmail.value !== initialEmail;

    if (showPasswordField) {
        setShowPassword(true);
    } else {
        setShowPassword(false);
    }

    const classes = useStyle(defaultClasses, propClasses);

    const maybeNewPasswordField = shouldShowNewPassword ? (
        <div className={classes.newPassword}>
            <Password
                fieldName="newPassword"
                label={formatMessage({
                    id: 'global.newPassword',
                    defaultMessage: 'New Password'
                })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword,
                    [isNotEqualToField, 'password']
                ])}
                isToggleButtonHidden={false}
            />
        </div>
    ) : null;

    const maybeChangePasswordButton = !shouldShowNewPassword ? (
        <div className={classes.changePasswordButtonContainer}>
            <Button classes={classes.changePasswordButton} priority="low" onClick={handleChangePassword}>
                <FormattedMessage id={'global.changePassword'} defaultMessage={'Change Password'} />
            </Button>
        </div>
    ) : null;

    const passwordLabel = shouldShowNewPassword
        ? formatMessage({
              id: 'global.currentPassword',
              defaultMessage: 'Current Password'
          })
        : formatMessage({
              id: 'global.password',
              defaultMessage: 'Password'
          });
    return (
        <Fragment>
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field
                        id="firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput field="email" validate={isRequired} />
                    </Field>
                </div>

                {shouldShowNewPassword || showPassword ? (
                    <div className={classes.password}>
                        <Password
                            fieldName="password"
                            label={passwordLabel}
                            validate={isRequired}
                            autoComplete="current-password"
                            isToggleButtonHidden={false}
                        />
                    </div>
                ) : null}
                {maybeNewPasswordField}
            </div>
            {maybeChangePasswordButton}
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    classes: shape({
        changePasswordButton: string,
        changePasswordButtonContainer: string,
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        password: string,
        newPassword: string
    }),
    handleChangePassword: func,
    shouldShowNewPassword: bool,
    customer: shape({ email: string, firstname: string, lastname: string, id: any }),
    showPassword: bool,
    setShowPassword: func.isRequired,
    email: string
};
