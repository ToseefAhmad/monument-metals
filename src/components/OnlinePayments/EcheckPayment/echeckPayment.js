import { Form } from 'informed';
import { bool, func, object, array } from 'prop-types';
import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { useEcheckPayment } from '@app/components/OnlinePayments/EcheckPayment/useEcheckPayment.js';
import Field from '@app/components/overrides/Field';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import {
    ACCOUNT_FIELD,
    ACCOUNT_TYPE_CONFIG,
    ROUTING_FIELD,
    SAVE_FIELD,
    TYPE_FIELD,
    VAULT_USE_FIELD,
    VAULT_FIELD,
    ACCOUNT_FIELD_CONFIRM
} from './echeckConfig';
import classes from './echeckPayment.module.css';
import { routingValid, isNumber, isEqualToAccount, validatePaste, validateConfirmPaste } from './echeckValidation';

const EcheckPayment = ({ shouldSubmit, onPaymentSuccess }) => {
    const {
        setEcheckFormApi,
        isVault,
        toggleVault,
        allowVault,
        vaultConfig,
        vaultLoading,
        handleFormSubmit,
        handleVaultSubmit,
        initialValuesEcheck
    } = useEcheckPayment({ shouldSubmit, onPaymentSuccess });

    const { formatMessage } = useIntl();

    if (vaultLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'bankTransfer.loadingPayment'} defaultMessage={'Loading Payment'} />
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

    const forbiddenCharacter = 'e';

    const typeOutput = (
        <Form
            initialValues={initialValuesEcheck}
            getApi={setEcheckFormApi}
            onSubmit={isVault ? handleVaultSubmit : handleFormSubmit}
        >
            {isVault ? (
                <div className={classes.vaultForm}>
                    <Field
                        id={VAULT_FIELD}
                        label={formatMessage({
                            id: 'echeckPayment.vaultSelect',
                            defaultMessage: 'Account'
                        })}
                    >
                        <Select field={VAULT_FIELD} id={VAULT_FIELD} items={vaultConfig} validate={isRequired} />
                    </Field>
                </div>
            ) : (
                <div>
                    <div className={classes.vaultForm}>
                        <Field
                            id={ROUTING_FIELD}
                            label={formatMessage({
                                id: 'echeckPayment.routingField',
                                defaultMessage: 'Routing number'
                            })}
                        >
                            <TextInput
                                field={ROUTING_FIELD}
                                id={ROUTING_FIELD}
                                maxLength="9"
                                validate={combine([isRequired, routingValid])}
                                placeholder={formatMessage({
                                    id: 'echeckPayment.routingFieldPlaceholder',
                                    defaultMessage: 'Enter the routing number'
                                })}
                            />
                        </Field>
                        <div className={classes.accountNumberWrapper}>
                            <Field
                                id={ACCOUNT_FIELD}
                                label={formatMessage({
                                    id: 'echeckPayment.accountField',
                                    defaultMessage: 'Account number'
                                })}
                            >
                                <TextInput
                                    field={ACCOUNT_FIELD}
                                    id={ACCOUNT_FIELD}
                                    validateOnchange
                                    onKeyDown={e => e.key === forbiddenCharacter && e.preventDefault()}
                                    onPaste={e => validatePaste(forbiddenCharacter, e)}
                                    validate={combine([isRequired, isNumber])}
                                    placeholder={formatMessage({
                                        id: 'echeckPayment.accountFieldPlaceholder',
                                        defaultMessage: 'Enter the account number'
                                    })}
                                />
                            </Field>
                            <Field
                                id={ACCOUNT_FIELD_CONFIRM}
                                label={formatMessage({
                                    id: 'echeckPayment.confirmAccountField',
                                    defaultMessage: 'Confirm account number'
                                })}
                            >
                                <TextInput
                                    field={ACCOUNT_FIELD_CONFIRM}
                                    validateOnchange
                                    onKeyDown={e => e.key === forbiddenCharacter && e.preventDefault()}
                                    onPaste={e => validateConfirmPaste(e)}
                                    id={ACCOUNT_FIELD_CONFIRM}
                                    validate={combine([isRequired, [isEqualToAccount, ACCOUNT_FIELD]])}
                                    placeholder={formatMessage({
                                        id: 'echeckPayment.confirmAccountFieldPlaceholder',
                                        defaultMessage: 'Confirm the account number'
                                    })}
                                />
                            </Field>
                        </div>
                        <Field
                            id={TYPE_FIELD}
                            label={formatMessage({
                                id: 'echeckPayment.accountTypeField',
                                defaultMessage: 'Account type'
                            })}
                            field={TYPE_FIELD}
                        >
                            <Select
                                field={TYPE_FIELD}
                                id={TYPE_FIELD}
                                items={ACCOUNT_TYPE_CONFIG}
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    <Field id={SAVE_FIELD}>
                        <Checkbox
                            dark
                            field={SAVE_FIELD}
                            label={formatMessage({
                                id: 'echeckPayment.save',
                                defaultMessage: 'Save for later use'
                            })}
                        />
                    </Field>
                </div>
            )}
        </Form>
    );

    return (
        <div className={classes.root}>
            {vaultContainer}
            {typeOutput}
        </div>
    );
};

EcheckPayment.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    echeckProps: object.isRequired,
    allowVault: bool.isRequired,
    isVault: bool.isRequired,
    toggleVault: func.isRequired,
    vaultConfig: array.isRequired,
    vaultLoading: bool.isRequired
};

export default EcheckPayment;
