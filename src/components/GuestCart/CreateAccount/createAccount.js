import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Popup from 'reactjs-popup';

import Button from '@app/components/overrides/Button';
import { POPUP_CONFIG } from '@app/util/popup';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired, validatePassword } from '@magento/venia-ui/lib/util/formValidators';

import classes from './createAccount.module.css';
import { useCreateAccount } from './useCreateAccount';

const CreateAccount = ({
    initialValues: propInitialValues,
    onSubmit,
    onCancel,
    isCancelButtonHidden,
    isPopupOpen,
    onPopupClose
}) => {
    const { handleCancel, handleSubmit, isDisabled, initialValues } = useCreateAccount({
        initialValues: propInitialValues,
        onSubmit,
        onCancel,
        onPopupClose
    });
    const { formatMessage } = useIntl();

    const loginIntoYourAccount = isCancelButtonHidden ? null : (
        <div className={classes.loginIntoYourAccount}>
            <FormattedMessage id={'createAccount.or'} defaultMessage={'Or '} />
            <button
                className={classes.loginIntoYourAccountAction}
                disabled={isDisabled}
                type="button"
                priority="low"
                onClick={handleCancel}
            >
                <FormattedMessage
                    id={'createAccount.loginIntoYourAccountText'}
                    defaultMessage={'Login into your account'}
                />
            </button>
        </div>
    );

    const submitButton = (
        <div className={classes.submitButtonContainer}>
            <Button disabled={isDisabled} type="submit" priority="normal">
                <FormattedMessage id={'createAccount.createAnAccount'} defaultMessage={'Create an Account'} />
            </Button>
        </div>
    );

    return (
        <Popup open={isPopupOpen} {...POPUP_CONFIG} onClose={onPopupClose}>
            <div className={classes.modal}>
                <div className={classes.closeIcon}>
                    <button onClick={onPopupClose}>
                        <Icon src={CloseIcon} size={32} />
                    </button>
                </div>
                <Form className={classes.root} initialValues={initialValues} onSubmit={handleSubmit}>
                    <p className={classes.title}>
                        <FormattedMessage id={'createAccount.createAccountText'} defaultMessage={'Create an account'} />
                    </p>
                    <div className={classes.fields}>
                        <Field
                            label={formatMessage({
                                id: 'createAccount.emailText',
                                defaultMessage: 'E-mail'
                            })}
                            id="customer.email"
                        >
                            <TextInput
                                id="customer.email"
                                field="customer.email"
                                autoComplete="email"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                placeholder={formatMessage({
                                    id: 'createAccount.emailPlaceholder',
                                    defaultMessage: 'Enter the e-mail'
                                })}
                            />
                        </Field>
                        <Field
                            label={formatMessage({
                                id: 'createAccount.firstNameText',
                                defaultMessage: 'First Name'
                            })}
                            id="customer.firstname"
                        >
                            <TextInput
                                id="customer.firstname"
                                field="customer.firstname"
                                autoComplete="given-name"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                placeholder={formatMessage({
                                    id: 'createAccount.firstNamePlaceholder',
                                    defaultMessage: 'Enter the first name'
                                })}
                            />
                        </Field>
                        <Field
                            label={formatMessage({
                                id: 'createAccount.lastNameText',
                                defaultMessage: 'Last Name'
                            })}
                            id="customer.lastname"
                        >
                            <TextInput
                                id="customer.lastname"
                                field="customer.lastname"
                                autoComplete="family-name"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                placeholder={formatMessage({
                                    id: 'createAccount.lastNamePlaceholder',
                                    defaultMessage: 'Enter the last name'
                                })}
                            />
                        </Field>
                        <Password
                            autoComplete="new-password"
                            fieldName="password"
                            isToggleButtonHidden={true}
                            label={formatMessage({
                                id: 'createAccount.passwordText',
                                defaultMessage: 'Password'
                            })}
                            validate={combine([isRequired, [hasLengthAtLeast, 8], validatePassword])}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            placeholder={formatMessage({
                                id: 'createAccount.passwordPlaceholder',
                                defaultMessage: 'Enter the password'
                            })}
                        />
                    </div>
                    <div className={classes.actions}>
                        {submitButton}
                        {loginIntoYourAccount}
                    </div>
                </Form>
            </div>
        </Popup>
    );
};

CreateAccount.propTypes = {
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func,
    isPopupOpen: bool,
    onPopupClose: func.isRequired
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
