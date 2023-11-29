import { node, bool } from 'prop-types';
import React from 'react';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Mask from '@magento/venia-ui/lib/components/Mask';

import classes from './maskedFullPageLoadingIndicator.module.css';

const MaskedFullPageLoadingIndicator = ({ children, isActive }) => {
    if (!isActive) {
        return null;
    }

    return (
        <div className={classes.root}>
            <LoadingIndicator global={true}>{children}</LoadingIndicator>
            <Mask
                isActive={isActive}
                classes={{ root_default: classes.mask_default, root_active: classes.mask_active, root: classes.mask }}
            />
        </div>
    );
};

MaskedFullPageLoadingIndicator.propTypes = {
    children: node,
    isActive: bool
};

MaskedFullPageLoadingIndicator.defaultProps = {
    isActive: false
};

export default MaskedFullPageLoadingIndicator;
