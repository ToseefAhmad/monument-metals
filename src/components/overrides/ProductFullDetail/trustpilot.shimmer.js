import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './trustpilot.shimmer.module.css';

/**
 * Trustpilot block shimmer component.
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Products Shimmer.
 */
const TrustpilotShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Shimmer
            aria-live="polite"
            aria-busy="true"
            classes={{
                root_rectangle: classes.root
            }}
        />
    );
};

TrustpilotShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default TrustpilotShimmer;
