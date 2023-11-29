import { Form } from 'informed';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Country from '@app/components/overrides/Country';
import Field from '@app/components/overrides/Field';
import Postcode from '@app/components/overrides/Postcode';
import Region from '@app/components/overrides/Region';
import TextInput from '@app/components/overrides/TextInput';
import { validatePhoneNumberRequired } from '@app/util/formValidators';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './addressForm.module.css';
import { useAddressForm } from './useAddressForm';

const AddressForm = ({
    onSuccess,
    resetSuccess,
    shippingData,
    shouldSubmit,
    resetShouldSubmit,
    onError,
    showInitialData
}) => {
    const { handleValueChange, initialValues, isLoading, setFormApi, handleCountryChange } = useAddressForm({
        onSuccess,
        resetSuccess,
        shippingData,
        shouldSubmit,
        resetShouldSubmit,
        onError,
        showInitialData
    });
    const { formatMessage } = useIntl();

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'addressForm.loading'} defaultMessage={'Fetching Customer Details...'} />
            </LoadingIndicator>
        );
    }

    return (
        <>
            <Form
                getApi={setFormApi}
                className={classes.root}
                initialValues={initialValues}
                onValueChange={handleValueChange}
            >
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'E-mail address'
                        })}
                    >
                        <TextInput
                            disabled={true}
                            field="email"
                            id="email"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.emailPlaceholder',
                                defaultMessage: 'Enter the e-mail address'
                            })}
                            validate={isRequired}
                            validateOnChange
                        />
                    </Field>
                </div>
                <div className={classes.firstname}>
                    <Field
                        id="customer_firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First name'
                        })}
                    >
                        <TextInput
                            field="firstname"
                            id="customer_firstname"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.firstNamePlaceholder',
                                defaultMessage: 'Enter the first name'
                            })}
                            validate={isRequired}
                            validateOnChange
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="customer_lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last name'
                        })}
                    >
                        <TextInput
                            field="lastname"
                            id="customer_lastname"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.lastNamePlaceholder',
                                defaultMessage: 'Enter the last name'
                            })}
                            validate={isRequired}
                            validateOnChange
                        />
                    </Field>
                </div>
                <div className={classes.company}>
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
                </div>
                <div className={classes.street}>
                    <Field
                        id="customer_street"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street address'
                        })}
                    >
                        <TextInput
                            field="street"
                            validate={isRequired}
                            validateOnChange
                            id="customer_street"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.streetAddressPlaceholder',
                                defaultMessage: 'Enter the street address'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field
                        id="customer_city"
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            field="city"
                            validate={isRequired}
                            validateOnChange
                            id="customer_city"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.cityPlaceholder',
                                defaultMessage: 'Enter the city'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.region}>
                    <Region
                        validate={isRequired}
                        validateOnChange
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey={'id'}
                    />
                </div>
                <div className={classes.postcode}>
                    <Postcode validate={isRequired} validateOnChange />
                </div>
                <div className={classes.country}>
                    <Country validate={isRequired} validateOnChange onValueChange={handleCountryChange} />
                </div>
                <div className={classes.telephone}>
                    <Field
                        id="customer_telephone"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone number'
                        })}
                    >
                        <TextInput
                            field="telephone"
                            validate={validatePhoneNumberRequired}
                            validateOnChange
                            id="customer_telephone"
                            placeholder={formatMessage({
                                id: 'shippingInformationAddressForm.phonePlaceholder',
                                defaultMessage: 'Enter the phone number'
                            })}
                        />
                    </Field>
                </div>
            </Form>
        </>
    );
};

AddressForm.defaultProps = {
    showInitialData: true,
    shippingData: {
        country: {
            code: DEFAULT_COUNTRY_CODE
        },
        region: {
            id: null
        }
    }
};

AddressForm.propTypes = {
    shouldSubmit: bool,
    showInitialData: bool,
    onSuccess: func.isRequired,
    resetSuccess: func.isRequired,
    resetShouldSubmit: func.isRequired,
    onError: func.isRequired,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        default_shipping: bool,
        email: string,
        firstname: string,
        id: number,
        lastname: string,
        postcode: string,
        region: shape({
            id: number
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    })
};

export default AddressForm;
