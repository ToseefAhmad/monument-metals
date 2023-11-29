import { shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ForgotPassword from '@app/components/overrides/ForgotPassword/forgotPassword';
import { useForgotPasswordPage } from '@magento/peregrine/lib/talons/ForgotPasswordPage/useForgotPasswordPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './forgotPasswordPage.module.css';

const ForgotPasswordPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { forgotPasswordProps } = useForgotPasswordPage(props);
    const { formatMessage } = useIntl();

    useEffect(() => {
        globalThis.document.body.classList.add('forgotPassword-page');

        return () => globalThis.document.body.classList.remove('forgotPassword-page');
    }, []);

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'forgotPasswordPage.title',
                    defaultMessage: 'Forgot Your Password?'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage id="forgotPasswordPage.header" defaultMessage="Forgot Your Password?" />
            </h1>
            <div className={classes.contentContainer}>
                <ForgotPassword {...forgotPasswordProps} />
            </div>
        </div>
    );
};

ForgotPasswordPage.defaultProps = {
    signedInRedirectUrl: '/order-history',
    signInPageUrl: '/sign-in'
};

ForgotPasswordPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default ForgotPasswordPage;
