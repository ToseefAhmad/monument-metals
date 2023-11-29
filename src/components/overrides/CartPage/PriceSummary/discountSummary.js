import { shape, string, array, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Shimmer from '@app/components/overrides/Shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

const MINUS_SYMBOL = '-';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    // Discounts from data can be null
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: discounts[0].amount.currency,
            value: discounts.reduce((acc, discount) => acc + discount.amount.value, 0)
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const DiscountSummary = ({ data, isLoading, classes: propClasses }) => {
    const classes = useStyle({}, propClasses);
    const discount = getDiscount(data);

    const priceContent = isLoading ? (
        <Shimmer width="47px" height="10px" />
    ) : (
        <span className={classes.price}>
            {MINUS_SYMBOL}
            <Price value={discount.value} currencyCode={discount.currency} />
        </span>
    );

    return discount.value ? (
        <>
            <span className={classes.lineItemLabel}>
                <FormattedMessage id={'discountSummary.discount'} defaultMessage={'Discount:'} />
            </span>
            {priceContent}
        </>
    ) : null;
};

DiscountSummary.propTypes = {
    classes: shape({
        lineItemLabel: string,
        price: string
    }),
    data: array,
    isLoading: bool
};

export default DiscountSummary;
