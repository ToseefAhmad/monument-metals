import { Form } from 'informed';
import { func, bool } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';
import Country from '@app/components/overrides/Country';
import Field from '@app/components/overrides/Field';
import FormError from '@app/components/overrides/FormError';
import Postcode from '@app/components/overrides/Postcode';
import Region from '@app/components/overrides/Region';
import TextInput from '@app/components/overrides/TextInput';
import { validatePhoneNumberRequired } from '@app/util/formValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './billingAddress.module.css';
import { useBillingAddress } from './useBillingAddress';

/**
 * Wrapper for billing address to make possible access form context in BillingAddress component
 * Otherwise, all default billing address functionality should be refactored
 */
const BillingAddressForm = props => {
    // Props validation happens in the BillingAddress component below
    // eslint-disable-next-line react/prop-types
    const { resetShouldSubmit } = props;

    const handleFormChanges = () => {
        resetShouldSubmit();
    };

    return (
        <Form onChange={handleFormChanges}>
            <BillingAddress {...props} />
        </Form>
    );
};

const BillingAddress = ({
    resetShouldSubmit,
    shouldSubmit,
    isShippingInformationDone,
    resetBillingAddressDone,
    onBillingAddressChangedError,
    onBillingAddressChangedSuccess
}) => {
    const { isBillingAddressSame, initialValues, shippingAddressCountry, errors } = useBillingAddress({
        resetShouldSubmit,
        shouldSubmit,
        isShippingInformationDone,
        resetBillingAddressDone,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    });
    const { formatMessage } = useIntl();

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     */
    const isFieldRequired = useCallback((value, { isBillingAddressSame = true }) => {
        if (isBillingAddressSame) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    return (
        <>
            <FormError classes={{ root: classes.formErrorContainer }} errors={Array.from(errors.values())} />
            <div className={classes.address_check}>
                <Checkbox
                    field="isBillingAddressSame"
                    label={formatMessage({
                        id: 'checkoutPage.billingAddressSame',
                        defaultMessage: 'My billing and shipping address are the same'
                    })}
                    initialValue={initialValues.isBillingAddressSame}
                />
            </div>
            <div className={billingAddressFieldsClassName}>
                <div className={classes.title}>
                    <h4>
                        <FormattedMessage id={'checkoutPage.billingAddress'} defaultMessage={'Billing address'} />
                    </h4>
                </div>
                <div className={classes.billingAddressFields}>
                    <Field
                        id="firstName"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First name'
                        })}
                    >
                        <TextInput
                            id="firstName"
                            field="firstName"
                            validate={isFieldRequired}
                            validateOnChange
                            initialValue={initialValues.firstName}
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.firstNamePlaceholder',
                                defaultMessage: 'Enter the first name'
                            })}
                        />
                    </Field>
                    <Field
                        id="lastName"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last name'
                        })}
                    >
                        <TextInput
                            id="lastName"
                            field="lastName"
                            validate={isFieldRequired}
                            validateOnChange
                            initialValue={initialValues.lastName}
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.lastNamePlaceholder',
                                defaultMessage: 'Enter the last name'
                            })}
                        />
                    </Field>
                    <Field
                        id="customer_company"
                        label={formatMessage({
                            id: 'global.company',
                            defaultMessage: 'Company'
                        })}
                        optional={true}
                    >
                        <TextInput
                            field="company"
                            id="customer_company"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.companyPlaceholder',
                                defaultMessage: 'Enter the company name'
                            })}
                        />
                    </Field>
                    <Field
                        id="street"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street address'
                        })}
                    >
                        <TextInput
                            id="street"
                            field="street"
                            validate={isFieldRequired}
                            validateOnChange
                            initialValue={initialValues.street}
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.streetAddressPlaceholder',
                                defaultMessage: 'Enter the street address'
                            })}
                        />
                    </Field>
                    <Field
                        id="city"
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            id="city"
                            field="city"
                            validate={isFieldRequired}
                            validateOnChange
                            initialValue={initialValues.city}
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.cityPlaceholder',
                                defaultMessage: 'Enter the city'
                            })}
                        />
                    </Field>
                    <Region initialValue={initialValues.region} validate={isFieldRequired} validateOnChange />
                    <Postcode validate={isFieldRequired} validateOnChange initialValue={initialValues.postcode} />
                    <Country
                        validate={isFieldRequired}
                        validateOnChange
                        initialValue={
                            /**
                             * If there is no initial value to start with
                             * use the country from shipping address.
                             */
                            initialValues.country || shippingAddressCountry
                        }
                    />
                    <Field
                        id="phoneNumber"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone number'
                        })}
                    >
                        <TextInput
                            id="phoneNumber"
                            field="phoneNumber"
                            validate={validatePhoneNumberRequired}
                            validateOnChange
                            initialValue={initialValues.phoneNumber}
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.phonePlaceholder',
                                defaultMessage: 'Enter the phone number'
                            })}
                        />
                    </Field>
                </div>
            </div>
        </>
    );
};

BillingAddress.propTypes = {
    resetShouldSubmit: func.isRequired,
    isShippingInformationDone: bool,
    shouldSubmit: bool,
    onBillingAddressChangedError: func.isRequired,
    onBillingAddressChangedSuccess: func.isRequired,
    resetBillingAddressDone: func.isRequired
};

export default BillingAddressForm;
