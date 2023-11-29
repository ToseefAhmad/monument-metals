import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './cmsMenu.shimmer.module.css';

/**
 *
 * @typedef cmsMenuShimmer
 * @kind functional component
 *
 * @returns {React.Element} A React component that displays a cmsMenu Shimmer.
 */
const cmsMenuShimmer = () => {
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

export default cmsMenuShimmer;
