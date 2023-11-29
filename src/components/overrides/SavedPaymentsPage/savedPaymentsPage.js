import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { METHOD_CODE as BASE_ECHECK_CODE } from '@app/components/OnlinePayments/EcheckPayment/echeckConfig';
import { METHOD_CODE as NMI_CODE } from '@app/components/OnlinePayments/NmiPayment/nmiConfig';
import { METHOD_CODE as PLAID_ECHECK_CODE } from '@app/components/OnlinePayments/PlaidEcheck/plaidEcheckConfig';
import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import SavedBaseAccountMethod from './savedBaseAccountMethod';
import SavedCcMethod from './savedCcMethod';
import classes from './savedPaymentsPage.module.css';
import SavedPlaidAccountMethod from './savedPlaidAccountMethod';

const SavedPaymentsPage = () => {
    const { isLoading, savedPayments } = useSavedPaymentsPage();
    const { formatMessage } = useIntl();

    const hasCcPayments = useMemo(() => {
        return (
            savedPayments.filter(paymentDetails => {
                return paymentDetails.payment_method_code === NMI_CODE;
            }).length > 0
        );
    }, [savedPayments]);

    const hasBaseAccountPayments = useMemo(() => {
        return (
            savedPayments.filter(paymentDetails => {
                return paymentDetails.payment_method_code === BASE_ECHECK_CODE;
            }).length > 0
        );
    }, [savedPayments]);

    const hasPlaidAccountPayments = useMemo(() => {
        return (
            savedPayments.filter(paymentDetails => {
                return paymentDetails.payment_method_code === PLAID_ECHECK_CODE;
            }).length > 0
        );
    }, [savedPayments]);

    const savedCcPaymentElements = useMemo(() => {
        if (hasCcPayments) {
            return savedPayments.map(paymentDetails => {
                if (paymentDetails.payment_method_code === NMI_CODE) {
                    return <SavedCcMethod key={paymentDetails.public_hash} {...paymentDetails} />;
                }
            });
        }
    }, [hasCcPayments, savedPayments]);

    const savedBaseAccountPaymentElements = useMemo(() => {
        if (hasBaseAccountPayments) {
            return savedPayments.map(paymentDetails => {
                if (paymentDetails.payment_method_code === BASE_ECHECK_CODE) {
                    return <SavedBaseAccountMethod key={paymentDetails.public_hash} {...paymentDetails} />;
                }
            });
        }
    }, [hasBaseAccountPayments, savedPayments]);

    const savedPlaidAccountPaymentElements = useMemo(() => {
        if (hasPlaidAccountPayments) {
            return savedPayments.map(paymentDetails => {
                if (paymentDetails.payment_method_code === PLAID_ECHECK_CODE) {
                    return <SavedPlaidAccountMethod key={paymentDetails.public_hash} {...paymentDetails} />;
                }
            });
        }
    }, [hasPlaidAccountPayments, savedPayments]);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'paymentMethods.loadingText'} defaultMessage={'Loading Payment Methods'} />
            </LoadingIndicator>
        );
    }

    const noSavedCcPayments = !hasCcPayments
        ? formatMessage({
              id: 'savedPaymentsPage.noSavedPayments',
              defaultMessage: 'You have no saved credit cards.'
          })
        : null;

    const noSavedAccountPayments =
        !hasBaseAccountPayments && !hasPlaidAccountPayments
            ? formatMessage({
                  id: 'savedPaymentsPage.noSavedAccountPayments',
                  defaultMessage: 'You have no saved accounts.'
              })
            : null;

    const savedCcPaymentsContent = hasCcPayments ? (
        <>
            <div className={classes.ccTableHead}>
                <span>
                    <FormattedMessage id={'savedPayments.CardTypeLabel'} defaultMessage={'Card Type'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.CardNumberLabel'} defaultMessage={'Card Number'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.ExpDateLabel'} defaultMessage={'Expiration Date'} />
                </span>
                <span className={classes.actionCell}>
                    <FormattedMessage id={'savedPayments.ActionLabel'} defaultMessage={'Action'} />
                </span>
            </div>
            {savedCcPaymentElements}
        </>
    ) : null;

    const savedBaseAccountPaymentsContent = hasBaseAccountPayments ? (
        <>
            <div className={classes.accountTableHead}>
                <span>
                    <FormattedMessage id={'savedPayments.BankLabel'} defaultMessage={'Bank'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.AccountNumberLabel'} defaultMessage={'Account Type'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.AccountNumberLabel'} defaultMessage={'Account Number'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.RoutingNumberLabel'} defaultMessage={'Routing Number'} />
                </span>
                <span className={classes.actionCell}>
                    <FormattedMessage id={'savedPayments.ActionLabel'} defaultMessage={'Action'} />
                </span>
            </div>
            {savedBaseAccountPaymentElements}
        </>
    ) : null;

    const savedPlaidAccountPaymentsContent = hasPlaidAccountPayments ? (
        <>
            <div className={classes.accountTableHead}>
                <span>
                    <FormattedMessage id={'savedPayments.BankLabel'} defaultMessage={'Bank'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.AccountName'} defaultMessage={'Account Type'} />
                </span>
                <span>
                    <FormattedMessage id={'savedPayments.AccountNumberLabel'} defaultMessage={'Account Number'} />
                </span>
                <span className={classes.actionCell}>
                    <FormattedMessage id={'savedPayments.ActionLabel'} defaultMessage={'Action'} />
                </span>
            </div>
            {savedPlaidAccountPaymentElements}
        </>
    ) : null;

    const title = formatMessage({
        id: 'paymentMethods.title',
        defaultMessage: 'Payment Methods'
    });

    return (
        <AccountPageWrapper pageTitle={title}>
            <div className={classes.root}>
                <div className={classes.cardsContent}>
                    <h3 className={classes.savedCardsTitle}>
                        <FormattedMessage
                            id={'savedPayments.CardsTitle'}
                            defaultMessage={'Your Credit and Debit Cards'}
                        />
                    </h3>
                    {savedCcPaymentsContent}
                </div>
                <div className={classes.noPayments}>{noSavedCcPayments}</div>
            </div>
            <div className={classes.root}>
                <div className={classes.cardsContent}>
                    <h3 className={classes.savedCardsTitle}>
                        <FormattedMessage id={'savedPayments.AccountsTitle'} defaultMessage={'Your Accounts'} />
                    </h3>
                    {savedBaseAccountPaymentsContent}
                    {savedPlaidAccountPaymentsContent}
                </div>
                <div className={classes.noPayments}>{noSavedAccountPayments}</div>
            </div>
        </AccountPageWrapper>
    );
};

export default SavedPaymentsPage;
