import { bool, func, object, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from '@app/components/overrides/Dialog';
import { validatePhoneNumberRequired } from '@app/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '@magento/venia-ui/lib/components/Country';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Region from '@magento/venia-ui/lib/components/Region';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './addEditDialog.module.css';

const AddEditDialog = props => {
    const { formErrors, formProps, isBusy, isEditMode, isOpen, onCancel, onConfirm } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    let formatTitleArgs;
    if (isEditMode) {
        formatTitleArgs = {
            id: 'addressBookPage.editDialogTitle',
            defaultMessage: 'Edit Address'
        };
    } else {
        formatTitleArgs = {
            id: 'addressBookPage.addDialogTitle',
            defaultMessage: 'New Address'
        };
    }
    const title = formatMessage(formatTitleArgs);

    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });

    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const street1Label = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });
    const defaultBillingAddressCheckLabel = formatMessage({
        id: 'addressBookPage.makeDefaultBillingAddress',
        defaultMessage: 'Make this my default billing address'
    });

    const defaultShippingAddressCheckLabel = formatMessage({
        id: 'addressBookPage.makeDefaultShippingAddress',
        defaultMessage: 'Make this my default shipping address'
    });

    const companyLabel = formatMessage({
        id: 'global.company',
        defaultMessage: 'Company'
    });

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            formProps={formProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isBusy}
            title={title}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={Array.from(formErrors.values())} />
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field id="firstname" label={firstNameLabel}>
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>

                <div className={classes.lastname}>
                    <Field id="lastname" label={lastNameLabel}>
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <Field optional id="company" label={companyLabel}>
                    <TextInput field="company" />
                </Field>
                <div className={classes.country}>
                    <Country field={'country_code'} validate={isRequired} />
                </div>

                <div className={classes.street1}>
                    <Field id="street1" label={street1Label}>
                        <TextInput field="street[0]" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field id="city" label={cityLabel}>
                        <TextInput field="city" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.region}>
                    <Region
                        countryCodeField={'country_code'}
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey="id"
                        validate={isRequired}
                    />
                </div>
                <div className={classes.postcode}>
                    <Postcode validate={isRequired} />
                </div>
                <div className={classes.telephone}>
                    <Field id="telephone" label={telephoneLabel}>
                        <TextInput field="telephone" validate={validatePhoneNumberRequired} />
                    </Field>
                </div>
                <div className={classes.default_address_check}>
                    <Checkbox field="default_shipping" label={defaultShippingAddressCheckLabel} />
                    <Checkbox field="default_billing" label={defaultBillingAddressCheckLabel} />
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditDialog;

AddEditDialog.propTypes = {
    classes: shape({
        root: string,
        city: string,
        country: string,
        default_address_check: string,
        errorContainer: string,
        firstname: string,
        lastname: string,
        middlename: string,
        postcode: string,
        region: string,
        street1: string,
        telephone: string
    }),
    formErrors: object,
    isEditMode: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func,
    isBusy: bool,
    formProps: object
};
