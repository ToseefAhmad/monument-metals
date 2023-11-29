import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './productSort.shimmer.module.css';

const ProductSortShimmer = () => {
    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.sortButtonShimmer}>
                <Shimmer />
            </div>
        </div>
    );
};

export default ProductSortShimmer;
