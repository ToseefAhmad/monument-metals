import { Form } from 'informed';
import { func, bool } from 'prop-types';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import Checkbox from '@app/components/overrides/Checkbox';
import LinkButton from '@app/components/overrides/LinkButton';
import { POPUP_CONFIG } from '@app/util/popup';
import { useScrollLock } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './termsAndConditions.module.css';

const TERMS_POPUP_CONFIG = {
    ...POPUP_CONFIG
};

const TermsAndConditions = ({ onSuccess, resetSuccess, shouldSubmit, resetShouldSubmit }) => {
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useScrollLock(isPopupOpen);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const label = (
        <span className={classes.label}>
            <FormattedMessage id={'termsAndConditions.agree'} defaultMessage={'I agree to the '} />
            <LinkButton className={classes.link} onClick={handlePopupOpen}>
                <FormattedMessage id={'termsAndConditions.text'} defaultMessage={'Terms and Conditions.'} />
            </LinkButton>
        </span>
    );

    const handleValueChange = ({ terms_and_conditions }) => {
        if (terms_and_conditions) {
            onSuccess();
        } else {
            resetSuccess();
            resetShouldSubmit();
        }
    };

    useEffect(() => {
        if (shouldSubmit) {
            formApiRef.current.validate();
        }
    }, [shouldSubmit, formApiRef]);

    return (
        <Form getApi={setFormApi} onValueChange={handleValueChange}>
            <Checkbox
                dark
                classes={{
                    root_error: classes.checkboxRootError,
                    label: classes.checkboxLabel
                }}
                field="terms_and_conditions"
                label={label}
                validate={isRequired}
                validateOnChange
            />
            <Popup open={isPopupOpen} {...TERMS_POPUP_CONFIG} onClose={handlePopupClose}>
                <div className={classes.modal}>
                    <div className={classes.closeIcon}>
                        <button onClick={handlePopupClose}>
                            <Icon src={CloseIcon} size={32} />
                        </button>
                    </div>
                    <div className={classes.content}>
                        <p className={classes.pb}>
                            By placing an order with Monument Metals, you are entering into a binding agreement. You
                            agree to lock in the prices and quantities listed above. Failure to pay for an order with
                            Monument Metals may result in liability under our{' '}
                            <Link to="/terms-and-conditions#market-loss-policy" target="_blank">
                                Market Loss Policy
                            </Link>
                        </p>
                        <ul className={classes.pb}>
                            <li className={classes.listEntry}>
                                If you are paying by paper check, payment must be mailed within one (1) business day and
                                received by Monument Metals within ten (10) business days.
                            </li>
                            <li className={classes.listEntry}>
                                Bank wire payments must be sent and received within one (1) business day.
                            </li>
                            <li className={classes.listEntry}>
                                When paying with eCheck, by authorizing this transaction, the customer agrees that
                                Monument Metals may convert this transaction into an Electronic Funds Transfer (EFT) via
                                ACH transaction and to debit this bank account for the amount specified. Additionally,
                                in the event this EFT is returned unpaid, a service fee, as allowable by law, will be
                                charged to this account via EFT or ACH. In the event you choose to revoke this
                                authorization, please do so by contacting the Monument Metals directly at{' '}
                                <a href={'mailto:support@monumentmetals.com'}>support@monumentmetals.com</a> or call{' '}
                                <a href={'tel:800-974-3121'}>800-974-3121</a>.
                            </li>
                            <li className={classes.listEntry}>
                                Please note that processing times may not allow for revocation of this authorization. We
                                recommend sending checks via USPS Priority Mail, FedEx or UPS to ensure timely delivery.
                                In the event that a payment is not sent and received within these timeframes, Monument
                                Metals reserves the right to cancel your order and hold you responsible for any market
                                loss incurred.
                            </li>
                        </ul>
                        <p>
                            Any market gain realized on an unpaid and/or cancelled order shall remain the property of
                            Monument Metals.
                        </p>
                        <p>
                            This is our Market Loss Policy. You can view our full terms and conditions{' '}
                            <Link to="/terms-and-conditions" target="_blank">
                                here
                            </Link>
                        </p>
                    </div>
                </div>
            </Popup>
        </Form>
    );
};

TermsAndConditions.propTypes = {
    onSuccess: func.isRequired,
    resetSuccess: func.isRequired,
    onError: func.isRequired,
    shouldSubmit: bool,
    resetShouldSubmit: func.isRequired
};

export default TermsAndConditions;
