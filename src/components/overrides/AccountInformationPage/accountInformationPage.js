import { objectOf, string } from 'prop-types';
import React, { Fragment, Suspense, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { Message } from '../Field';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import AccountInformationPageOperations from './accountInformationPage.gql.js';
import defaultClasses from './accountInformationPage.module.css';
import { useAccountInformationPage } from './useAccountInformationPage';

const EditModal = React.lazy(() => import(/* webpackChunkName: "editModal" */ './editModal'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [showPassword, setShowPassword] = useState(false);

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations,
        showPassword
    });

    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    } = talonProps;

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={'Something went wrong. Please refresh and try again.'}
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return <LoadingIndicator />;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;

        pageContent = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <div className={classes.lineItemsContainer}>
                        <span className={classes.nameLabel}>
                            <FormattedMessage id={'accountInformation.name'} defaultMessage={'Name:'} />
                        </span>
                        <span className={classes.nameValue}>{customerName}</span>
                        <span className={classes.emailLabel}>
                            <FormattedMessage id={'accountInformation.email'} defaultMessage={'E-mail:'} />
                        </span>
                        <span className={classes.emailValue}>{customer.email}</span>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.editInformationButton}
                            disabled={false}
                            onClick={showUpdateMode}
                            priority="normal"
                        >
                            <FormattedMessage id={'global.editButton'} defaultMessage={'Edit'} />
                        </Button>
                    </div>
                </div>
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <AccountPageWrapper pageTitle="My Profile">
            <div className={classes.root}>{errorMessage ? errorMessage : pageContent}</div>
        </AccountPageWrapper>
    );
};

AccountInformationPage.propTypes = {
    classes: objectOf(string)
};

export default AccountInformationPage;
