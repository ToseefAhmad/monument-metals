import { bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ItemsReview from '@app/components/CheckoutPage/ItemsReview';
import Countdown from '@app/components/PriceFreeze';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';

import classes from './orderSummary.module.css';

const OrderSummary = ({ isUpdating, isCountdownVisible }) => {
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <h4 className={classes.title}>
                    <FormattedMessage id={'checkoutPage.orderSummary'} defaultMessage={'Order Summary'} />
                </h4>
            </div>
            {isCountdownVisible && (
                <div className={classes.container}>
                    <Countdown />
                </div>
            )}
            <div className={classes.container}>
                <ItemsReview />
            </div>
            <div className={classes.container}>
                <PriceSummary isUpdating={isUpdating} isCheckout={true} />
            </div>
        </div>
    );
};

OrderSummary.propTypes = {
    isUpdating: bool,
    setIsUpdating: func.isRequired,
    isCountdownVisible: bool
};

OrderSummary.defaultProps = {
    isCountdownVisible: true
};

export default OrderSummary;
