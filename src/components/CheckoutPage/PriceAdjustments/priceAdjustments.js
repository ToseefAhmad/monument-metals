import { func } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';

import classes from './priceAdjustments.module.css';

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = ({ setPageIsUpdating }) => {
    const { formatMessage } = useIntl();

    return (
        <div>
            <Accordion>
                <Section
                    classes={{
                        root: classes.sectionRoot,
                        contents_container: classes.sectionContentsContainer,
                        title_wrapper: classes.sectionTitleWrapper
                    }}
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'checkoutPage.discount',
                        defaultMessage: 'Discount'
                    })}
                >
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                </Section>
            </Accordion>
        </div>
    );
};

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};

export default PriceAdjustments;
