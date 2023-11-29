import { arrayOf, bool, number, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import RadioGroup from '@app/components/overrides/RadioGroup';

import ShippingRadio from './shippingRadio';
import classes from './shippingRadios.module.css';

const ShippingRadios = ({ shippingMethods }) => {
    const { formatMessage } = useIntl();

    const ERROR_MESSAGE = formatMessage({
        id: 'shippingRadios.errorLoading',
        defaultMessage: 'Currently, we do not ship to your selected area. Please, verify your shipping address again.'
    });

    if (!shippingMethods.length) {
        return <span className={classes.error}>{ERROR_MESSAGE}</span>;
    }

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const shippingRadios = shippingMethods.map(method => {
        const label = (
            <ShippingRadio currency={method.amount.currency} name={method.method_title} price={method.amount.value} />
        );
        const value = method.serializedValue;

        return { label, value };
    });

    return (
        <RadioGroup classes={radioGroupClasses} field="shipping_method" id={'shippingMethod'} items={shippingRadios} />
    );
};

ShippingRadios.propTypes = {
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
    ).isRequired
};

export default ShippingRadios;
