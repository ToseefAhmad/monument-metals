import { Form } from 'informed';
import { func, bool, instanceOf } from 'prop-types';
import React from 'react';

import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

import classes from './paymentInformation.module.css';
import PaymentMethod from './paymentMethod';
import { usePaymentInformation } from './usePaymentInformation';

const PaymentInformation = ({ onSave, resetShouldSubmit, shouldSubmit, checkoutError, onError }) => {
    const { handlePaymentError, handlePaymentSuccess } = usePaymentInformation({
        onSave,
        onError,
        checkoutError,
        resetShouldSubmit
    });

    return (
        <div className={classes.root}>
            <div className={classes.payment_info_container}>
                <Form>
                    <PaymentMethod
                        onPaymentError={handlePaymentError}
                        onPaymentSuccess={handlePaymentSuccess}
                        resetShouldSubmit={resetShouldSubmit}
                        shouldSubmit={shouldSubmit}
                    />
                </Form>
            </div>
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    onError: func.isRequired,
    shouldSubmit: bool
};
