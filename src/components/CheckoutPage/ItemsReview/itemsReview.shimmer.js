import React from 'react';

import Shimmer from '@app/components/overrides/Shimmer';

import classes from './itemsReview.module.css';

const ItemsReviewShimmer = () => {
    return (
        <div className={classes.shimmer}>
            <div className={classes.shimmerItem}>
                <div className={classes.shimmerImage}>
                    <Shimmer width="60px" height="60px" />
                </div>
                <div className={classes.shimmerContent}>
                    <div className={classes.shimmerName}>
                        <Shimmer width="100%" height="21px" />
                    </div>
                    <div className={classes.shimmerNameSecond}>
                        <Shimmer width="30%" height="21px" />
                    </div>
                    <div className={classes.shimmerPrice}>
                        <Shimmer width="120px" height="22px" />
                    </div>
                </div>
            </div>
            <div className={classes.shimmerItem}>
                <div className={classes.shimmerImage}>
                    <Shimmer width="60px" height="60px" />
                </div>
                <div className={classes.shimmerContent}>
                    <div className={classes.shimmerName}>
                        <Shimmer width="100%" height="21px" />
                    </div>
                    <div className={classes.shimmerNameSecond}>
                        <Shimmer width="30%" height="21px" />
                    </div>
                    <div className={classes.shimmerPrice}>
                        <Shimmer width="120px" height="22px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsReviewShimmer;
