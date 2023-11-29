import { object, func, bool } from 'prop-types';
import React, { useCallback } from 'react';
import { Check } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from '@magento/venia-ui/lib/components/ProductSort/sortItem.module.css';

import customClasses from './button.module.css';

const ButtonItem = props => {
    const { item, setExpanded, setActiveTab, storeConfig, active } = props;

    const classes = mergeClasses(defaultClasses, customClasses);

    const title = storeConfig[`amasty_xsearch_${item.code}_title`];

    const handleClick = useCallback(() => {
        setExpanded(false);
        setActiveTab({
            title: title,
            typeName: item.__typename,
            count: item.total_count
        });
    }, [setExpanded, setActiveTab, item, title]);

    const activeIcon = active ? <Icon size={20} src={Check} /> : null;

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.text}>
                    {title}
                    <span className={classes.counter}>{item.total_count}</span>
                </span>

                {activeIcon}
            </span>
        </button>
    );
};

ButtonItem.propTypes = {
    item: object,
    setExpanded: func,
    setActiveTab: func,
    setCount: func,
    storeConfig: object,
    active: bool
};

export default ButtonItem;
