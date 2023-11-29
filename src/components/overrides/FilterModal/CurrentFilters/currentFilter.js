import { shape, string, func, object } from 'prop-types';
import React, { useCallback } from 'react';
import { X as Remove } from 'react-feather';
import { useIntl } from 'react-intl';

import Icon from '@app/components/overrides/Icon';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import defaultClasses from './currentFilter.module.css';

const CurrentFilter = props => {
    const { group, item, removeItem, onRemove } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof onRemove === 'function') {
            onRemove(group, item);
        }
    }, [group, item, removeItem, onRemove]);

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter'
        },
        {
            name: item.title
        }
    );
    const categoryTitle = group.replace(/_/, ' ') + ': ';

    return (
        <span className={classes.root}>
            <span className={classes.categoryTitle}>{categoryTitle}</span>
            <span className={classes.categoryValue}>{item.title}</span>
            <Trigger action={handleClick} ariaLabel={ariaLabel}>
                <Icon size={12} src={Remove} />
            </Trigger>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    onRemove: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func,
    group: string,
    item: object,
    removeItem: func
};
