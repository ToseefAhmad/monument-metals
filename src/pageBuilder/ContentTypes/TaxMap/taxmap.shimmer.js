import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './taxmap.shimmer.module.css';

/**
 * Page Builder Taxmap Shimmer component.
 *
 * @typedef TaxmapShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Taxmap Shimmer.
 */
const TaxmapShimmer = () => {
    return (
        <Shimmer
            aria-live="polite"
            aria-busy="true"
            classes={{
                root_rectangle: defaultClasses.root
            }}
        />
    );
};

export default TaxmapShimmer;
