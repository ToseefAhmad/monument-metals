import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './listItemShimmer.module.css';

const GalleryListItemShimmer = ({ items }) => {
    return items.map(index => (
        <div key={index} className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.imageColumn}>
                <div className={classes.label}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.images}>
                    <Shimmer>
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
            </div>
            <div className={classes.descriptionColumn}>
                <div className={classes.name}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.price}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.addToCart}>
                    <Shimmer height="100%" width="100%" />
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.shipping}>
                    <Shimmer height="100%" width="100%" />
                </div>
            </div>
            <div className={classes.tableColumn}>
                <Shimmer height="100%" width="100%" />
            </div>
        </div>
    ));
};

export default GalleryListItemShimmer;
