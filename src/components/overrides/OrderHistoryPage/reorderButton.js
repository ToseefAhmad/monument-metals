import { array, shape, string, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './reorderButton.module.css';

const ReorderButton = props => {
    const { handleReorderItems } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <button className={classes.root} onClick={handleReorderItems}>
            <span>
                <FormattedMessage id={'orderHistoryPage.reorderButton'} defaultMessage={'Reorder'} />
            </span>
        </button>
    );
};
export default ReorderButton;

ReorderButton.propTypes = {
    classes: shape({
        root: string
    }),
    items: array,
    orderNumber: string,
    handleReorderItems: func
};
