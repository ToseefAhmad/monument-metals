import { string } from 'prop-types';
import React from 'react';

import CmsShimmer from '@app/RootComponents/CMS/cms.shimmer';
import TYPES from '@magento/venia-ui/lib/RootComponents/Shimmer/types';

const RootShimmer = props => {
    const { type } = props;

    if (!type || typeof TYPES[type] === 'undefined') {
        return <CmsShimmer />;
    }

    const Component = TYPES[type];

    return <Component />;
};

RootShimmer.defaultProps = {
    type: null
};

RootShimmer.propTypes = {
    type: string
};

export default RootShimmer;
