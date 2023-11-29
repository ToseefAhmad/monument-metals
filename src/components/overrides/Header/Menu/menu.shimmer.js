import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './menu.module.css';

const MenuShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.shimmer} aria-live="polite" aria-busy="true">
            <Shimmer height="32px" width="100%" />
        </div>
    );
};

MenuShimmer.propTypes = {
    classes: shape({
        shimmer: string
    })
};

export default MenuShimmer;
