import { Form } from 'informed';
import { bool, func } from 'prop-types';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { CC_NUM_ID, CC_EXP_ID, CC_CVV_ID, VAULT_FIELD, CC_USE_ID } from './nmiConfig';
import classes from './nmiPayment.module.css';
import { useNmiPayment } from './useNmiPayment';

const NmiPayment = ({ shouldSubmit, onPaymentSuccess }) => {
    const {
        isLoading,
        allowVault,
        isVault,
        toggleVault,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    } = useNmiPayment({
        shouldSubmit,
        onPaymentSuccess
    });
    const { formatMessage } = useIntl();

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'bankTransfer.loadingPayment'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const vaultContainer = allowVault ? (
        <div className={classes.modeSwitch}>
            <Field id={CC_USE_ID}>
                <Checkbox
                    dark
                    label="Use saved credit card"
                    field={CC_USE_ID}
                    initialValue={isVault}
                    onChange={toggleVault}
                />
            </Field>
        </div>
    ) : null;

    const typeOutput = isVault ? (
        <Form getApi={setVaultFormApi} onSubmit={handleVaultSubmit} className={classes.vaultForm}>
            <Field
                id={VAULT_FIELD}
                label={formatMessage({
                    id: 'nmiPayment.vaultSelect',
                    defaultMessage: 'Credit Card'
                })}
            >
                <Select field={VAULT_FIELD} id={VAULT_FIELD} items={vaultConfig} validate={isRequired} />
            </Field>
        </Form>
    ) : (
        <>
            <div className={classes.ccFields}>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccLabel',
                        defaultMessage: 'Card details'
                    })}
                >
                    <div className={classes.ccNumber} id={CC_NUM_ID} />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccExp',
                        defaultMessage: 'Card date'
                    })}
                >
                    <div className={classes.expiration} id={CC_EXP_ID} />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccCvv',
                        defaultMessage: 'CVV code'
                    })}
                >
                    <div className={classes.cvv} id={CC_CVV_ID} />
                </Field>
            </div>
        </>
    );

    return (
        <div className={classes.root}>
            {vaultContainer}
            {typeOutput}
        </div>
    );
};

NmiPayment.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func
};

export default NmiPayment;
