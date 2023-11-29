import { Form } from 'informed';
import { func } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';
import TextInput from '@app/components/overrides/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import classes from './signIn.module.css';
import { useSignIn } from './useSignIn';

const SignIn = ({ onCreateAccount, onForgotPassword }) => {
    const { handleCreateAccount, handleForgotPassword, handleSubmit, isBusy } = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        onCreateAccount,
        onForgotPassword
    });
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <div className={classes.formContainer}>
                <h4>
                    <FormattedMessage id={'guestCart.newCustomers'} defaultMessage={'New Customers'} />
                </h4>
                <p>
                    <FormattedMessage
                        id={'guestCart.registerText'}
                        defaultMessage={'If you do not have an account yet, you can create a new one now.'}
                    />
                </p>
                <div className={classes.buttonContainer}>
                    <Button priority="normal" onClick={handleCreateAccount}>
                        <FormattedMessage id={'guestCart.registerNow'} defaultMessage={'Register Now'} />
                    </Button>
                </div>
            </div>
            <div className={classes.formContainer}>
                <h4>
                    <FormattedMessage id={'guestCart.returningCustomers'} defaultMessage={'Returning Customers'} />
                </h4>
                <p>
                    <FormattedMessage
                        id={'guestCart.signInText'}
                        defaultMessage={
                            'Log in to your existing Monument Metals account below and proceed to checkout.'
                        }
                    />
                </p>
                <Form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.emailAndPasswordFields}>
                        <div className={classes.field}>
                            <Field
                                label={formatMessage({
                                    id: 'guestCart.emailAddressText',
                                    defaultMessage: 'E-mail'
                                })}
                                id="guest_cart_email"
                            >
                                <TextInput
                                    placeholder={formatMessage({
                                        id: 'guestCart.emailAdressPlaceholder',
                                        defaultMessage: 'Enter the e-mail'
                                    })}
                                    autoComplete="email"
                                    field="email"
                                    id="guest_cart_email"
                                    type="email"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                        <div className={classes.field}>
                            <Field
                                label={formatMessage({
                                    id: 'guestCart.passwordText',
                                    defaultMessage: 'Password'
                                })}
                                id="guest_cart_password"
                            >
                                <TextInput
                                    placeholder={formatMessage({
                                        id: 'guestCart.passwordPlaceholder',
                                        defaultMessage: 'Enter the password'
                                    })}
                                    type="password"
                                    autoComplete="current-password"
                                    field="password"
                                    id="guest_cart_password"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                    </div>
                    <div className={classes.forgotPasswordAndRememberMeContainer}>
                        <Checkbox
                            field="rememberMe"
                            label={formatMessage({ id: 'guestCart.rememberMe', defaultMessage: 'Remember me' })}
                        />
                        <LinkButton
                            classes={{
                                root: classes.forgotPasswordButton
                            }}
                            type="button"
                            onClick={handleForgotPassword}
                        >
                            <FormattedMessage id={'guestCart.forgotPassword'} defaultMessage={'Forgot password?'} />
                        </LinkButton>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button priority="normal" type="submit" disabled={isBusy}>
                            <FormattedMessage id={'guestCart.button'} defaultMessage={'Checkout Securely Now'} />
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

SignIn.propTypes = {
    onCreateAccount: func.isRequired,
    onForgotPassword: func.isRequired
};

export default SignIn;
