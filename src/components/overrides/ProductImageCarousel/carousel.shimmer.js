import { object } from 'prop-types';
import React, { useMemo } from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.module.css';
import defaultShimmerClasses from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.shimmer.module.css';

const CarouselShimmer = props => {
    const classes = useStyle(defaultClasses, defaultShimmerClasses, props.classes);

    const thumbnails = useMemo(() => {
        return Array.from({ length: 3 })
            .fill(null)
            .map((value, index) => {
                return (
                    <div className={classes.thumnailRoot} key={`thumbnail-${index}`}>
                        <Image alt={'...'} classes={{ image: classes.thumbnailImage }} src={transparentPlaceholder} />
                    </div>
                );
            });
    }, [classes]);

    return (
        <div className={classes.root}>
            <div className={classes.carouselContainer}>
                <Image
                    alt={'...'}
                    classes={{
                        image: classes.currentImage_placeholder,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </div>
            <div className={classes.thumbnailList}>{thumbnails}</div>
        </div>
    );
};

CarouselShimmer.propTypes = {
    classes: object
};

export default CarouselShimmer;
