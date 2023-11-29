import { Form } from 'informed';
import { bool, func, array } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import {
    CC_CVV_ID,
    CC_EXP_ID,
    CC_NUM_ID,
    CC_USE_ID,
    CONFIRM_CC_ID,
    VAULT_FIELD
} from '@app/components/OnlinePayments/NmiPayment/nmiConfig';
import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './ccForm.module.css';

const CcForm = props => {
    const {
        allowVault,
        isVault,
        toggleVault,
        isConfirmed,
        toggleConfirmed,
        vaultConfig,
        setVaultFormApi,
        handleVaultSubmit
    } = props;

    const { formatMessage } = useIntl();

    const title = formatMessage({
        id: 'sharedCc.title',
        defaultMessage: 'SECURE YOUR PAYMENT VIA CREDIT/DEBIT CARD'
    });

    const info = formatMessage({
        id: 'sharedCc.info',
        defaultMessage:
            'Orders placed via the check/money order or wire transfer payment method require a credit/debit card onfile to lock in pricing, verify your identity, and, if necessary, enforce our market loss policy. Your card will NOT be charged at this time, nor will it ever be charged unless you cancel your order or fail to complete payment within 10 days (check/money order) or 1 business day (wire transfer). Your order balance is fully payable by check/money order or wire transfer (based on the payment method you select). Our mailing address is shown above for check/money order and our wiring instructions will be included on your order confirmation for wire transfer orders.'
    });

    const note = formatMessage({
        id: 'sharedCc.note',
        defaultMessage:
            '* Please note that you must enter your billing address exactly as it appears on your credit card statement.'
    });

    const sharedCcInformation = (
        <div className={classes.sharedInfoWrapper}>
            <Accordion>
                <Section
                    classes={{
                        contents_container: classes.sectionContentContainer,
                        title_wrapper: classes.sectionTitleWrapper,
                        title: classes.sectionTitle
                    }}
                    id={'secure_your_payment'}
                    title={title}
                >
                    <div className={classes.sharedInfo}>
                        <p>{info}</p>
                        <p>{note}</p>
                    </div>
                </Section>
            </Accordion>
        </div>
    );

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
            <div className={classes.confirmCheckbox}>
                <Field id={CONFIRM_CC_ID}>
                    <Checkbox
                        dark
                        field={CONFIRM_CC_ID}
                        classes={{ label: classes.inputLabel }}
                        label={formatMessage({
                            id: 'nmiPayment.saveCC',
                            defaultMessage:
                                'I understand my card will only be charged in the event of non-payment or cancellation that results in market loss.'
                        })}
                        initialValue={isConfirmed}
                        onChange={toggleConfirmed}
                        validate={isRequired}
                        validateOnChange
                    />
                </Field>
            </div>
        </Form>
    ) : (
        <>
            <div className={classes.ccFields}>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccLabel',
                        defaultMessage: 'Card details'
                    })}
                    id={CC_NUM_ID}
                >
                    <div className={classes.ccNumber} id={CC_NUM_ID} />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccExp',
                        defaultMessage: 'Card date'
                    })}
                    id={CC_EXP_ID}
                >
                    <div className={classes.expiration} id={CC_EXP_ID} />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'nmiPayment.ccCvv',
                        defaultMessage: 'CVV code'
                    })}
                    id={CC_CVV_ID}
                >
                    <div className={classes.cvv} id={CC_CVV_ID} />
                </Field>
            </div>
            <div className={classes.confirmCheckbox}>
                <Field id={CONFIRM_CC_ID}>
                    <Checkbox
                        dark
                        field={CONFIRM_CC_ID}
                        classes={{ label: classes.inputLabel }}
                        label={formatMessage({
                            id: 'nmiPayment.saveCC',
                            defaultMessage:
                                'I understand my card will only be charged in the event of non-payment or cancellation that results in market loss.'
                        })}
                        initialValue={isConfirmed}
                        onChange={toggleConfirmed}
                        validate={isRequired}
                        validateOnChange
                    />
                </Field>
            </div>
        </>
    );

    return (
        <>
            {sharedCcInformation}
            {vaultContainer}
            {typeOutput}
        </>
    );
};

CcForm.propTypes = {
    allowVault: bool.isRequired,
    isVault: bool.isRequired,
    toggleVault: func.isRequired,
    isSaveCc: bool.isRequired,
    toggleSaveCc: func.isRequired,
    isConfirmed: bool.isRequired,
    toggleConfirmed: func.isRequired,
    vaultConfig: array.isRequired,
    setVaultFormApi: func.isRequired,
    handleVaultSubmit: func.isRequired
};

export default CcForm;
