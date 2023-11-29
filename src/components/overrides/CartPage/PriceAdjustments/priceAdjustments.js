import { func, string, node } from 'prop-types';
import React, { Suspense } from 'react';

import EstimateTax from '@app/components/CartEstimate/estimateTax';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import defaultClasses from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

/**
 * PriceAdjustments is a child component of the CartPage component.
 * It renders the price adjustments forms for applying gift cards, coupons, and the shipping method.
 * All of which can adjust the cart total.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating A callback function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments'
 */
const PriceAdjustments = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { fetchCartDetails, setIsCartUpdating, children } = props;

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section id={'sales_tax'} title="Calculate Sales Tax">
                    <Suspense fallback={<LoadingIndicator />}>
                        <EstimateTax fetchCartDetails={fetchCartDetails} />
                    </Suspense>
                </Section>
                {children}
                <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    fetchCartDetails: func,
    setIsCartUpdating: func,
    classes: string,
    children: node
};
