import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './cartPayment.module.css';

const CartPaymentShimmer = () => {
    return (
        <div className={classes.wrapper} aria-live="polite" aria-busy="true">
            <div className={classes.descriptionContainer}>
                <div className={classes.titleShimmer}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.descriptionShimmer}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.descriptionShimmer}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.descriptionShimmer}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.descriptionMobileShimmer}>
                    <Shimmer width="100%" height="100%" />
                </div>
            </div>
            <div className={classes.paymentHeaderTabShimmer}>
                <Shimmer width="100%" height="56px" borderRadius="3px" />
            </div>
            <div className={classes.options}>
                <div className={classes.optionShimmer}>
                    <Shimmer width="100%" height="100%" borderRadius="3px" />
                </div>
                <div className={classes.optionShimmer}>
                    <Shimmer width="100%" height="100%" borderRadius="3px" />
                </div>
                <div className={classes.optionShimmer}>
                    <Shimmer width="100%" height="100%" borderRadius="3px" />
                </div>
                <div className={classes.optionShimmer}>
                    <Shimmer width="100%" height="100%" borderRadius="3px" />
                </div>
                <div className={classes.optionShimmer}>
                    <Shimmer width="100%" height="100%" borderRadius="3px" />
                </div>
            </div>
        </div>
    );
};

export default CartPaymentShimmer;
