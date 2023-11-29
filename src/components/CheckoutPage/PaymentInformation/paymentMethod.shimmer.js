import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './paymentMethod.module.css';

const PaymentMethodShimmer = () => {
    return (
        <>
            <div className={classes.shimmer} aria-live="polite" aria-busy="true">
                <Shimmer width="100%" height="100%" borderRadius="3px" />
            </div>
            <div className={classes.shimmerButtonContainer}>
                <Shimmer width="100%" />
            </div>
        </>
    );
};

export default PaymentMethodShimmer;
