import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './toggleViewButton.module.css';

const ToggleViewButtonShimmer = () => {
    return (
        <div className={classes.shimmerRoot} aria-live="polite" aria-busy="true">
            <div className={classes.shimmerButton}>
                <Shimmer classes={{ root: classes.shimmerButtonRoot }} type="button" key="toggle-view-button-grid" />
            </div>
            <div className={classes.shimmerButton}>
                <Shimmer key="toggle-view-button-list" />
            </div>
        </div>
    );
};

export default ToggleViewButtonShimmer;
