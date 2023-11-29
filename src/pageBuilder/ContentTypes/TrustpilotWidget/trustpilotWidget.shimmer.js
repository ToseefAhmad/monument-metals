import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './trustpilotWidget.module.css';

/**
 * Trustpilot widget Slider Shimmer component.
 *
 */
const TrustpilotShimmer = () => {
    return (
        <div className={classes.shimmer} aria-live="polite" aria-busy="true">
            <Shimmer height="65px" width="100%" />
        </div>
    );
};

export default TrustpilotShimmer;
