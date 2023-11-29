import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired, validatePassword } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createAccount.module.css';
import { useCreateAccount } from './useCreateAccount';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const { handleCancel, handleSubmit, isDisabled, initialValues } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const loginIntoYourAccount = props.isCancelButtonHidden ? null : (
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
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
