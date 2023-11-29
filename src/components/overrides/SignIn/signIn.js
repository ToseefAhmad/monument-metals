import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import LinkButton from '@app/components/overrides/LinkButton';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import defaultClasses from './signIn.module.css';
import { useSignIn } from './useSignIn';

const SignIn = ({ setDefaultUsername, showCreateAccount, showForgotPassword, classes: propsClasses }) => {
    const { handleCreateAccount, handleForgotPassword, handleSubmit, isBusy, setFormApi } = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const classes = useStyle(defaultClasses, propsClasses);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <p className={classes.desktopDropdownTitle}>
                <FormattedMessage id={'signIn.desktopDropdownTitle'} defaultMessage={'Login'} />
            </p>
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.emailAndPasswordFields}>
                    <Field
                        label={formatMessage({
                            id: 'signIn.emailAddressText',
                            defaultMessage: 'E-mail'
                        })}
                        id="email"
                    >
                        <TextInput
                            placeholder={formatMessage({
                                id: 'signIn.emailAdressPlaceholder',
                                defaultMessage: 'Enter the e-mail'
                            })}
                            autoComplete="email"
                            field="email"
                            id="email"
                            type="email"
                            validate={isRequired}
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'signIn.passwordText',
                            defaultMessage: 'Password'
                        })}
                        id="password"
                    >
                        <TextInput
                            placeholder={formatMessage({
                                id: 'signIn.passwordPlaceholder',
                                defaultMessage: 'Enter the password'
                            })}
                            type="password"
                            autoComplete="current-password"
                            field="password"
                            id="password"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.forgotPasswordAndRememberMeContainer}>
                    <Checkbox
                        field="rememberMe"
                        label={formatMessage({ id: 'signIn.rememberMe', defaultMessage: 'Remember me' })}
                    />
                    <LinkButton
                        classes={{
                            root: classes.forgotPasswordButton
                        }}
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        <FormattedMessage id={'signIn.forgotPassword'} defaultMessage={'Forgot password?'} />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="normal" type="submit" disabled={isBusy}>
                        <FormattedMessage id={'signIn.signInText'} defaultMessage={'Login'} />
                    </Button>
                    <span className={classes.createAccount}>
                        <FormattedMessage id={'signIn.createAccountTextOr'} defaultMessage={'Or '} />
                        <LinkButton type="button" onClick={handleCreateAccount}>
                            <FormattedMessage id={'signIn.createAccountText'} defaultMessage={'Create an Account'} />
                        </LinkButton>
                    </span>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
