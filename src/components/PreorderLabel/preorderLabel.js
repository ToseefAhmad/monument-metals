import { object, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './preorderLabel.module.css';

const PREORDER_STOCK_STATUS = 'PREORDER';

const PreorderLabel = ({ stockStatus = '', preorderNote = '', classes: propClasses = null } = {}) => {
    const classes = useStyle(defaultClasses, propClasses);

    return stockStatus === PREORDER_STOCK_STATUS ? (
        <div className={classes.root}>
            <div className={classes.preorderLabel}>Pre-order</div>
            {preorderNote && <div className={classes.preorderNote}>{preorderNote}</div>}
        </div>
    ) : null;
};

PreorderLabel.propTypes = {
    stockStatus: string,
    preorderNote: string,
    classes: object
};

export default PreorderLabel;
