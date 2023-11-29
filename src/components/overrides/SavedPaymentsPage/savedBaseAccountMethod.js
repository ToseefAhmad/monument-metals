import { object, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Delete as DeleteIcon } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import LinkButton from '@app/components/overrides/LinkButton';
import { ToastType, useToasts } from '@app/hooks/useToasts';

import classes from './savedMethod.module.css';
import { useSavedMethod } from './useSavedMethod';

const SavedBaseAccountMethod = ({ payment_method_code, public_hash, details }) => {
    const {
        handleDeletePayment,
        hasError,
        isConfirmingDelete,
        isDeletingPayment,
        toggleDeleteConfirmation
    } = useSavedMethod({ paymentHash: public_hash });

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const [bank, setBank] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');

    useEffect(() => {
        const { masked_account, customer_bank } = details;
        const accountDetails = masked_account.split(':');

        setBank(customer_bank);
        setRoutingNumber(accountDetails[1]);
        setAccountNumber(accountDetails[2]);

        if (accountDetails[0] === 'C') {
            setAccountType('Checking');
        } else {
            setAccountType('Savings');
        }
    }, [details, payment_method_code]);

    useEffect(() => {
        if (hasError) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'savedPaymentsPage.creditCard.errorRemoving',
                    defaultMessage: 'Something went wrong deleting this payment method. Please refresh and try again.'
                })
            });
        }
    }, [addToast, formatMessage, hasError]);

    const rootClass = isConfirmingDelete ? classes.accountRoot_active : classes.accountRoot;

    const deleteButton = (
        <LinkButton
            classes={{ root: classes.deleteButton }}
            disabled={isConfirmingDelete}
            onClick={toggleDeleteConfirmation}
        >
            <Icon size={16} src={DeleteIcon} />
        </LinkButton>
    );

    const deleteConfirmationOverlayClass = isConfirmingDelete
        ? classes.deleteConfirmationContainer
        : classes.deleteConfirmationContainer_hidden;

    const deleteConfirmationOverlay = isConfirmingDelete ? (
        <div className={deleteConfirmationOverlayClass}>
            <div className={classes.confirmationButtonContainer}>
                <Button disabled={isDeletingPayment} onClick={toggleDeleteConfirmation} priority="low" type="button">
                    <FormattedMessage id={'global.cancelButton'} defaultMessage={'Cancel'} />
                </Button>
            </div>
            <div className={classes.confirmationButtonContainer}>
                <Button
                    disabled={isDeletingPayment}
                    onClick={handleDeletePayment}
                    negative={true}
                    priority="normal"
                    type="button"
                >
                    <FormattedMessage id={'global.deleteButton'} defaultMessage={'Delete'} />
                </Button>
            </div>
        </div>
    ) : null;

    return (
        <div className={rootClass}>
            <div className={classes.typeField}>
                <span className={classes.mobileCardTypeLabel}>
                    <FormattedMessage id={'savedPaymentsPage.BankLabel'} defaultMessage={'Bank: '} />
                </span>
                {bank}
            </div>
            <div className={classes.typeField}>
                <span className={classes.mobileCardTypeLabel}>
                    <FormattedMessage id={'savedPaymentsPage.AccountNumberLabel'} defaultMessage={'Account Type: '} />
                </span>
                {accountType}
            </div>
            <div className={classes.cardNumberField}>
                <span className={classes.mobileCardNumberLabel}>
                    <FormattedMessage id={'savedPaymentsPage.AccountNumberLabel'} defaultMessage={'Account Number: '} />
                </span>
                {accountNumber}
            </div>
            <div className={classes.cardNumberField}>
                <span className={classes.mobileCardNumberLabel}>
                    <FormattedMessage id={'savedPaymentsPage.RoutingNumberLabel'} defaultMessage={'Routing Number: '} />
                </span>
                {routingNumber}
            </div>
            <div className={classes.deleteField}>{deleteButton}</div>
            {deleteConfirmationOverlay}
        </div>
    );
};

export default SavedBaseAccountMethod;

SavedBaseAccountMethod.propTypes = {
    payment_method_code: string,
    details: object,
    public_hash: string
};
