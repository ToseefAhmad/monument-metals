import { shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import SignIn from '@magento/venia-ui/lib/components/SignIn';

import defaultClasses from './signInPage.module.css';
import { useSignInPage } from './useSignInPage';

const SignInPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { signInProps } = useSignInPage(props);
    const { formatMessage } = useIntl();

    useEffect(() => {
        globalThis.document.body.classList.add('signin-page');

        return () => globalThis.document.body.classList.remove('signin-page');
    }, []);

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'signInPage.title',
                    defaultMessage: 'Sign In'
                })}
            </StoreTitle>
            <h1 className={classes.title}>
                <FormattedMessage id="signInPage.header" defaultMessage="Sign In or Create Account" />
            </h1>
            <div className={classes.contentContainer}>
                <SignIn {...signInProps} />
            </div>
        </div>
    );
};

SignInPage.defaultProps = {
    createAccountPageUrl: '/create-account',
    forgotPasswordPageUrl: '/forgot-password',
    signedInRedirectUrl: '/order-history'
};

SignInPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    createAccountPageUrl: string,
    forgotPasswordPageUrl: string,
    signedInRedirectUrl: string
};

export default SignInPage;
