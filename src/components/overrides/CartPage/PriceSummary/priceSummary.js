import { array, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Shimmer from '@app/components/overrides/Shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import ShippingSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import TaxSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/taxSummary';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './priceSummary.module.css';
import { usePriceSummary } from './usePriceSummary';

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = ({ isUpdating, isCheckout, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { hasError, hasItems, isLoading, flatData } = usePriceSummary();

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'priceSummary.errorText'}
                        defaultMessage={'Something went wrong. Please refresh and try again.'}
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const { subtotal, total, discounts, taxes, shipping } = flatData;

    const isPriceUpdating = isUpdating || isLoading;

    const subtotalContent = isPriceUpdating ? (
        <Shimmer width="47px" height="10px" />
    ) : (
        <span className={classes.price}>
            <Price value={subtotal.value} currencyCode={subtotal.currency} />
        </span>
    );

    const grandTotalContent = isPriceUpdating ? (
        <Shimmer width="60px" height="10px" />
    ) : (
        <span className={classes.totalPrice}>
            <Price value={total.value} currencyCode={total.currency} />
        </span>
    );

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id={'priceSummary.subtotal'} defaultMessage={'Subtotal:'} />
                </span>
                {subtotalContent}
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={discounts}
                    isLoading={isPriceUpdating}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price,
                        noTax: classes.noTax
                    }}
                    data={taxes}
                    shipping={shipping}
                    isCheckout={isCheckout}
                    isLoading={isPriceUpdating}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={shipping}
                    isLoading={isPriceUpdating}
                />
                <span className={classes.totalLabel}>
                    <FormattedMessage id={'priceSummary.grandTotal'} defaultMessage={'Grand total:'} />
                </span>

                {grandTotalContent}
            </div>
        </div>
    );
};

PriceSummary.propTypes = {
    isUpdating: bool,
    isCheckout: bool,
    classes: array
};

export default PriceSummary;
