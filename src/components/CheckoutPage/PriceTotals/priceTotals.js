import { shape } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import ShippingSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import TaxSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/taxSummary';
import Price from '@magento/venia-ui/lib/components/Price';

import classes from './priceTotals.module.css';

/**
 * Renders price totals component.
 *
 * @param flatData
 * @returns {JSX.Element}
 */
const PriceTotals = ({ flatData }) => {
    const { subtotal, total, discounts, taxes, shipping, appliedCoupons } = flatData;

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id={'priceSummary.subtotal'} defaultMessage={'Subtotal:'} />
                </span>
                <span className={classes.price}>
                    <Price value={subtotal.value} currencyCode={subtotal.currency} />
                </span>
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={discounts}
                    appliedCoupons={appliedCoupons}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={taxes}
                    isSuccess={true}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={shipping}
                />
                <span className={classes.totalLabel}>
                    <FormattedMessage id={'priceSummary.grandTotal'} defaultMessage={'Grand total:'} />
                </span>
                <span className={classes.totalPrice}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
        </div>
    );
};

PriceTotals.propTypes = {
    flatData: shape({})
};

PriceTotals.defaultProps = {
    flatData: {}
};

export default PriceTotals;
