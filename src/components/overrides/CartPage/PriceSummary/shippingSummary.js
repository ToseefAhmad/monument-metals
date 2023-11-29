import { shape, string, array, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Shimmer from '@app/components/overrides/Shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = ({ data, isLoading, classes: propClasses }) => {
    const classes = useStyle({}, propClasses);

    // Don't render estimated shipping until an address has been provided and
    // A method has been selected.
    if (!data.length || !data[0].selected_shipping_method) {
        return null;
    }

    const shipping = data[0].selected_shipping_method.amount;

    // For a value of "0", display "FREE".
    const price = shipping.value ? (
        <Price value={shipping.value} currencyCode={shipping.currency} />
    ) : (
        <span>
            <FormattedMessage id={'global.free'} defaultMessage={'FREE'} />
        </span>
    );

    const priceContent = isLoading ? (
        <Shimmer width="47px" height="10px" />
    ) : (
        <span className={classes.price}>{price}</span>
    );

    return (
        <>
            <span className={classes.lineItemLabel}>
                <FormattedMessage id={'shippingSummary.shippingAndHandling'} defaultMessage={'Shipping & Handling:'} />
            </span>
            {priceContent}
        </>
    );
};

ShippingSummary.propTypes = {
    classes: shape({
        lineItemLabel: string,
        price: string
    }),
    data: array,
    isLoading: bool
};

export default ShippingSummary;
