import { shape, string } from 'prop-types';
import React from 'react';

import Shimmer from '@app/components/overrides/Shimmer';
import CMSHomePageShimmer from '@app/RootComponents/CMS/cmsHomePage.shimmer';

const CMSPageShimmer = () => {
    return window?.location?.pathname === '/' ? (
        <CMSHomePageShimmer />
    ) : (
        <div aria-live="polite" aria-busy="true">
            <Shimmer width="100%" height="880px" key="banner" />
        </div>
    );
};

CMSPageShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default CMSPageShimmer;
