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

const SavedCcMethod = ({ payment_method_code, public_hash, details }) => {
    const {
        handleDeletePayment,
        hasError,
        isConfirmingDelete,
        isDeletingPayment,
        toggleDeleteConfirmation
    } = useSavedMethod({ paymentHash: public_hash });

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const [cardType, setCardType] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    useEffect(() => {
        const { type, lastCcNumber, expirationDate } = details;
        setCardNumber('XXXX-XXXX-XXXX-' + lastCcNumber);
        setCardType(type);
        setExpirationDate(expirationDate);
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

    const rootClass = isConfirmingDelete ? classes.ccRoot_active : classes.ccRoot;

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
                    <FormattedMessage id={'savedPaymentsPage.cardTypeLabel'} defaultMessage={'Card Type: '} />
                </span>
                {cardType}
            </div>
            <div className={classes.cardNumberField}>
                <span className={classes.mobileCardNumberLabel}>
                    <FormattedMessage id={'savedPaymentsPage.cardNumberLabel'} defaultMessage={'Card Number: '} />
                </span>
                {cardNumber}
            </div>
            <div className={classes.dateField}>
                <span className={classes.mobileExpirationDateLabel}>
                    <FormattedMessage
                        id={'savedPaymentsPage.expirationDateLabel'}
                        defaultMessage={'Expiration Date: '}
                    />
                </span>
                {expirationDate}
            </div>
            <div className={classes.deleteField}>{deleteButton}</div>
            {deleteConfirmationOverlay}
        </div>
    );
};

export default SavedCcMethod;

SavedCcMethod.propTypes = {
    payment_method_code: string,
    details: object,
    public_hash: string
};
