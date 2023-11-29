import React from 'react';

import Shimmer from '@app/components/overrides/Shimmer';
import { useScreenSize } from '@app/hooks/useScreenSize';

import classes from './cmsHomePage.shimmer.module.css';

const CMSHomePageShimmer = () => {
    const { isMobileScreen } = useScreenSize();
    const catTileHeight = isMobileScreen ? '120px' : '220px';
    const catTitleHeight = isMobileScreen ? '42px' : '52px';

    return (
        <div className={classes.homeShimmer}>
            <Shimmer width="100%" height="410px" key="banner-1" />
            <div className={classes.brandRow}>
                <Shimmer width="100%" height="77px" key="banner-2" />
                <Shimmer width="100%" height="77px" key="banner-3" />
                <Shimmer width="100%" height="77px" key="banner-4" />
                <Shimmer width="100%" height="77px" key="banner-5" />
            </div>
            <div className={classes.catBlock}>
                <div>
                    <Shimmer width="30%" height={catTitleHeight} key="cat-title" />
                    <div className={classes.categoryRow}>
                        <Shimmer width="100%" height={catTileHeight} key="cat-tile-1" />
                        <Shimmer width="100%" height={catTileHeight} key="cat-tile-2" />
                        <Shimmer width="100%" height={catTileHeight} key="cat-tile-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMSHomePageShimmer;
