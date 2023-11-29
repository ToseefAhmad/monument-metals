import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './sortedByContainer.module.css';

const SortedByContainerShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width={10} />
        </div>
    );
};

SortedByContainerShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default SortedByContainerShimmer;
