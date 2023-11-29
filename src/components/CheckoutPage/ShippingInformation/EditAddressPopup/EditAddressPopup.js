import { Form } from 'informed';
import { number, shape, arrayOf, string, bool } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Popup from 'reactjs-popup';

import { Edit } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import Country from '@app/components/overrides/Country';
import Field from '@app/components/overrides/Field';
import Icon from '@app/components/overrides/Icon';
import Postcode from '@app/components/overrides/Postcode';
import Region from '@app/components/overrides/Region';
import TextInput from '@app/components/overrides/TextInput';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { validatePhoneNumberRequired } from '@app/util/formValidators';
import { POPUP_CONFIG } from '@app/util/popup';
import { useScrollLock } from '@magento/peregrine';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './editAddressPopup.module.css';
import { useEditAddressPopup } from './useEditAddressPopup';

const EditAddressPopup = ({ selectedAddressId, address }) => {
    const {
        initialValues,
        isLoading,
        handleSubmit,
        isPopupOpen,
        handlePopupOpen,
        handlePopupClose
    } = useEditAddressPopup({
        selectedAddressId,
        address
    });
    const { formatMessage } = useIntl();
    const { isMobileScreen } = useScreenSize();

    useScrollLock(isMobileScreen && isPopupOpen);

    return (
        <>
            <button className={classes.editButton} onClick={handlePopupOpen}>
                <Icon src={Edit} />
                <FormattedMessage id={'editAddressPopup.edit'} defaultMessage={'Edit'} />
            </button>
            <Popup open={isPopupOpen} onClose={handlePopupClose} {...POPUP_CONFIG}>
                <div className={classes.modal}>
                    <div className={classes.header}>
                        <h4 className={classes.title}>
                            <FormattedMessage
                                id={'editAddressPopup.editShippingAddress'}
                                defaultMessage={'Edit shipping address'}
                            />
                        </h4>
                        <div className={classes.closeIcon}>
                            <button className={classes.closeButton} onClick={handlePopupClose}>
                                <Icon src={CloseIcon} size={32} />
                            </button>
                        </div>
                    </div>
                    <Form className={classes.form} initialValues={initialValues} onSubmit={handleSubmit}>
                        <div className={classes.fields}>
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
                                            id: 'editAddressPopup.firstNamePlaceholder',
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
                                            id: 'editAddressPopup.lastNamePlaceholder',
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
                                            id: 'editAddressPopup.companyPlaceholder',
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
                                            id: 'editAddressPopup.streetAddressPlaceholder',
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
                                            id: 'editAddressPopup.cityPlaceholder',
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
                                <Country validate={isRequired} validateOnChange />
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
                                            id: 'editAddressPopup.phonePlaceholder',
                                            defaultMessage: 'Enter the phone number'
                                        })}
                                    />
                                </Field>
                            </div>
                        </div>
                        <div className={classes.checkboxWrapper}>
                            <Checkbox
                                field="default_shipping"
                                label={formatMessage({
                                    id: 'editAddressPopup.makeDefaultShippingAddress',
                                    defaultMessage: 'Make this my default shipping address'
                                })}
                            />
                        </div>
                        <div className={classes.actions}>
                            <div className={classes.closeButtonWrapper}>
                                <Button priority="low" onClick={handlePopupClose}>
                                    <FormattedMessage id={'editAddressPopup.close'} defaultMessage={'Close'} />
                                </Button>
                            </div>
                            <div className={classes.updateButtonWrapper}>
                                <Button priority="high" type="submit" disabled={isLoading}>
                                    <FormattedMessage id={'editAddressPopup.update'} defaultMessage={'Update'} />
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Popup>
        </>
    );
};

EditAddressPopup.propTypes = {
    selectedAddressId: number,
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        firstname: string,
        lastname: string,
        postcode: string,
        company: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string)
    }).isRequired
};

export default EditAddressPopup;
