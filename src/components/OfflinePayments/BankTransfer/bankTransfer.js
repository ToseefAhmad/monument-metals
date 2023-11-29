import { bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CcForm from '@app/components/OfflinePayments/SharedCC/ccForm';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './banktransfer.module.css';
import { useBankTransfer } from './useBankTransfer';

const BankTransfer = ({ shouldSubmit, onPaymentSuccess }) => {
    const {
        instructions,
        isLoading,
        isCcAllowed,
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    } = useBankTransfer({ shouldSubmit, onPaymentSuccess });

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'bankTransfer.loadingPayment'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const ccProps = {
        allowVault,
        isVault,
        toggleVault,
        isSaveCc,
        toggleSaveCc,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    };

    const onlineForm = isCcAllowed ? (
        <div className={classes.ccForm}>
            <CcForm {...ccProps} />
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.instructions}>
                <p className={classes.title}>
                    <FormattedMessage id={'bankTransfer.instructions'} defaultMessage={'Instructions'} />
                </p>
                <p className={classes.content}>{instructions}</p>
            </div>
            {onlineForm}
        </div>
    );
};

BankTransfer.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func.isRequired
};

export default BankTransfer;
