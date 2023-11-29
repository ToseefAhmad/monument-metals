import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './filterModalOpenButton.shimmer.module.css';

const FilterModalOpenButtonShimmer = () => {
    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.filterButtonShimmer}>
                <Shimmer />
            </div>
        </div>
    );
};

export default FilterModalOpenButtonShimmer;
