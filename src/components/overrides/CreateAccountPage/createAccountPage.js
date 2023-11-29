import { shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './createAccountPage.module.css';

const CreateAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { createAccountProps } = useCreateAccountPage(props);
    const { formatMessage } = useIntl();

    useEffect(() => {
        globalThis.document.body.classList.add('createAccount-page');

        return () => globalThis.document.body.classList.remove('createAccount-page');
    }, []);

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'createAccountPage.title',
                    defaultMessage: 'Create an Account'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage id="createAccountPage.header" defaultMessage="Create an Account" />
            </h1>
            <div className={classes.contentContainer}>
                <CreateAccount {...createAccountProps} />
            </div>
        </div>
    );
};

CreateAccountPage.defaultProps = {
    signedInRedirectUrl: '/order-history',
    signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
