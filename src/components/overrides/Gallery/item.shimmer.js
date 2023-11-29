import { shape, string } from 'prop-types';
import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './item.module.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.images}>
                <Shimmer key="product-image">
                    <Image
                        alt="Placeholder for gallery item image"
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        src={transparentPlaceholder}
                    />
                </Shimmer>
            </div>
            <div className={classes.nameWrapper}>
                <div className={classes.name}>
                    <Shimmer width="90%" key="product-name" />
                    <Shimmer width="40%" key="product-name-second-row" />
                </div>
            </div>
            <div className={classes.priceWrapperShimmer}>
                <Shimmer width="50%" key="product-price" />
            </div>
            <div className={classes.actionsContainerShimmer}>
                <div className={classes.buttonShimmer}>
                    <Shimmer key="product-qty" width="100%" />
                </div>
                <div className={classes.buttonShimmer}>
                    <Shimmer key="product-add-button" width="100%" />
                </div>
            </div>
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
