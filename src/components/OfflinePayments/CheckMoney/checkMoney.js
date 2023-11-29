import { bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CcForm from '@app/components/OfflinePayments/SharedCC/ccForm';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './checkMoney.module.css';
import { useCheckMoney } from './useCheckMoney';

const CheckMoney = ({ shouldSubmit, onPaymentSuccess }) => {
    const {
        checkAddress,
        additionalInfo,
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
    } = useCheckMoney({ shouldSubmit, onPaymentSuccess });

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
            <div className={classes.contentWrapper}>
                <p className={classes.title}>
                    <FormattedMessage id={'checkMoney.address'} defaultMessage={'Payment Address'} />
                </p>
                <p className={classes.content}>{checkAddress}</p>
            </div>
            <div className={classes.contentWrapper}>
                <p className={classes.title}>
                    <FormattedMessage id={'checkMoney.information'} defaultMessage={'Instructions'} />
                </p>
                <p className={classes.content}>{additionalInfo}</p>
            </div>
            {onlineForm}
        </div>
    );
};

CheckMoney.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func.isRequired
};

export default CheckMoney;
