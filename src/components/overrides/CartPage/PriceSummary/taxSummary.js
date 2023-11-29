import { shape, string, array, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Shimmer from '@app/components/overrides/Shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

/**
 * Reduces applied tax amounts into a single amount.
 *
 * @param {Array} applied_taxes
 */
const getEstimatedTax = (applied_taxes = []) => {
    return {
        currency: applied_taxes[0].amount.currency,
        value: applied_taxes.reduce((acc, tax) => acc + tax.amount.value, 0)
    };
};

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * A component that renders the tax summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const TaxSummary = ({ data, shipping, isLoading, isCheckout, isSuccess, classes: propClasses }) => {
    const classes = useStyle({}, propClasses);

    const label = (
        <span className={classes.lineItemLabel}>
            <FormattedMessage id={'taxSummary.taxLabel'} defaultMessage={'Tax:'} />
        </span>
    );

    if (isLoading) {
        return (
            <>
                {label}
                <Shimmer width="47px" height="10px" />
            </>
        );
    }

    if (!isSuccess && !isCheckout && (!shipping.length || !shipping[0].postcode.length)) {
        return (
            <>
                {label}
                <span className={classes.noTax}>
                    <span className={classes.price}>
                        <FormattedMessage
                            id={'taxSummary.cartNoTaxMessage'}
                            defaultMessage={'Calculated at Checkout'}
                        />
                    </span>
                </span>
            </>
        );
    }

    if (!data.length && isSuccess) {
        return (
            <>
                {label}
                <span className={classes.price}>
                    <Price value={DEFAULT_AMOUNT.value} currencyCode={DEFAULT_AMOUNT.currency} />
                </span>
            </>
        );
    }

    // Don't render estimated taxes until an address has been provided which
    // Causes the server to apply a tax value to the cart.
    if (!data.length) {
        return (
            <>
                {label}
                <span className={classes.noTax}>
                    <span className={classes.price}>
                        <Price value={DEFAULT_AMOUNT.value} currencyCode={DEFAULT_AMOUNT.currency} />
                    </span>
                </span>
            </>
        );
    }

    const tax = getEstimatedTax(data);

    return (
        <>
            {label}
            <span className={classes.price}>
                <Price value={tax.value} currencyCode={tax.currency} />
            </span>
        </>
    );
};

TaxSummary.propTypes = {
    classes: shape({
        lineItemLabel: string,
        price: string,
        noTax: string
    }),
    data: array,
    shipping: array,
    isSuccess: bool,
    isCheckout: bool,
    isLoading: bool
};

export default TaxSummary;
