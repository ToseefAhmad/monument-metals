import { Form } from 'informed';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import React from 'react';

import ShippingRadios from './shippingRadios';

const ShippingForm = ({ formInitialValues, handleSubmit, shippingMethods }) => {
    return (
        <Form onValueChange={handleSubmit} initialValues={formInitialValues}>
            <ShippingRadios shippingMethods={shippingMethods} />
        </Form>
    );
};

ShippingForm.propTypes = {
    formInitialValues: object,
    handleCancel: func,
    handleSubmit: func,
    isOpen: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    )
};

export default ShippingForm;
