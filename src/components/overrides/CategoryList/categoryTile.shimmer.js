import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './categoryTile.module.css';

const CategoryTileShimmer = () => {
    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.imageShimmer}>
                <Shimmer key="category-image">
                    <Image
                        alt="Placeholder for category item image"
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        src={transparentPlaceholder}
                    />
                </Shimmer>
            </div>
            <div className={classes.contentShimmer}>
                <div className={classes.name}>
                    <Shimmer width="100%" key="category-name" />
                    <Shimmer width="40%" key="category-name-second-row" />
                </div>
                <div className={classes.shopNow}>
                    <Shimmer width="60%" key="category-shop-now-link" />
                </div>
            </div>
        </div>
    );
};

export default CategoryTileShimmer;
