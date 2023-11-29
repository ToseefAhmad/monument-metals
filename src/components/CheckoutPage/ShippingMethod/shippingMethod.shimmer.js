import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './shippingMethod.module.css';

const ShippingMethodShimmer = () => {
    return (
        <div className={classes.shimmer} aria-live="polite" aria-busy="true">
            <div className={classes.shimmerContainer}>
                <Shimmer width="100%" height="100%" borderRadius="3px" />
            </div>
            <div className={classes.shimmerContainer}>
                <Shimmer width="100%" height="100%" borderRadius="3px" />
            </div>
        </div>
    );
};

export default ShippingMethodShimmer;
