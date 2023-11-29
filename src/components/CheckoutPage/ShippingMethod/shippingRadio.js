import { number, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import Price from '@magento/venia-ui/lib/components/Price';

import classes from './shippingRadio.module.css';

const ShippingRadio = ({ name, price, currency }) => {
    const priceElement = price ? (
        <Price value={price} currencyCode={currency} />
    ) : (
        <span>
            <FormattedMessage id={'global.free'} defaultMessage={'FREE'} />
        </span>
    );

    return (
        <Fragment>
            <span>{name}</span>
            <div className={classes.price}>{priceElement}</div>
        </Fragment>
    );
};

export default ShippingRadio;

ShippingRadio.propTypes = {
    currency: string.isRequired,
    name: string.isRequired,
    price: number.isRequired
};
