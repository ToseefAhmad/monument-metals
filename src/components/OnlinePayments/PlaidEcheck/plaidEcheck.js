import { Form } from 'informed';
import { bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { usePlaidLink } from 'react-plaid-link';

import { VAULT_FIELD, VAULT_USE_FIELD } from '@app/components/OnlinePayments/PlaidEcheck/plaidEcheckConfig';
import { usePlaidEcheck } from '@app/components/OnlinePayments/PlaidEcheck/usePlaidEcheck.js';
import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './plaidEcheck.module.css';

const PlaidEcheck = ({ shouldSubmit, onPaymentSuccess }) => {
    const {
        setVaultFormApi,
        linkTokenLoading,
        linkToken,
        onPlaidSuccess,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        vaultLoading,
        handleVaultSubmit,
        initialValues
    } = usePlaidEcheck({ shouldSubmit, onPaymentSuccess });

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            onPlaidSuccess(public_token, metadata);
        }
    });

    const { formatMessage } = useIntl();

    if (linkTokenLoading || !linkToken || vaultLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'plaidEcheck.loadingPayment'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const vaultContainer = allowVault ? (
        <div className={classes.modeSwitch}>
            <Field id={VAULT_USE_FIELD}>
                <Checkbox
                    dark
                    label="Use saved account"
                    field={VAULT_USE_FIELD}
                    initialValue={isVault}
                    onChange={toggleVault}
                />
            </Field>
        </div>
    ) : null;

    const typeOutput = (
        <div>
            {isVault ? (
                <Form initialValues={initialValues} getApi={setVaultFormApi} onSubmit={handleVaultSubmit}>
                    <div className={classes.vaultForm}>
                        <Field
                            id={VAULT_FIELD}
                            label={formatMessage({
                                id: 'plaidEcheckPayment.vaultSelect',
                                defaultMessage: 'Account'
                            })}
                        >
                            <Select field={VAULT_FIELD} id={VAULT_FIELD} items={vaultConfig} validate={isRequired} />
                        </Field>
                    </div>
                </Form>
            ) : (
                <Button onClick={() => open()} disabled={!ready}>
                    Link your online bank account
                </Button>
            )}
        </div>
    );

    return (
        <div className={classes.root}>
            {vaultContainer}
            {typeOutput}
        </div>
    );
};

PlaidEcheck.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func
};

export default PlaidEcheck;
