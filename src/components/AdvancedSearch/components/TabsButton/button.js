import { object, func } from 'prop-types';
import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';

import { useAmXsearchContext } from '../../context';
import { useTabs } from '../../talons/tabs/useTabs';

import classes from '@app/components/overrides/ProductSort/productSort.module.css';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import Icon from '@magento/venia-ui/lib/components/Icon';

import ButtonItem from './buttonItem';

const Button = props => {
    const { setActiveTab, activeTab } = props;

    const { storeConfig } = useAmXsearchContext();

    const { elementRef, expanded, setExpanded } = useDropdown();
    const { data: tabsData, isEnabled, isHasTab } = useTabs();

    const items = Object.values(tabsData).map(item => {
        if (
            !item.total_count ||
            (!storeConfig[`amasty_xsearch_${item.code}_enabled`] && item.__typename !== 'XsearchProducts')
        ) {
            return null;
        }

        return (
            <li key={item.code} className={classes.menuItem}>
                <ButtonItem
                    item={item}
                    setActiveTab={setActiveTab}
                    setExpanded={setExpanded}
                    storeConfig={storeConfig}
                />
            </li>
        );
    });

    const sortElements = useMemo(() => {
        if (!expanded) {
            return null;
        }

        return <ul className={classes.menu}>{items}</ul>;
    }, [expanded, items]);

    const handleItemClick = useCallback(() => {
        setExpanded(!expanded);
    }, [setExpanded, expanded]);

    const tabButton = (
        <button onClick={handleItemClick} className={classes.sortButton}>
            <span className={classes.mobileText}>{activeTab.title}</span>
            <span className={classes.desktopText}>
                <span className={classes.sortText}>{activeTab.title}</span>
                <Icon
                    src={ArrowDown}
                    classes={{
                        root: classes.desktopIconWrapper,
                        icon: classes.desktopIcon
                    }}
                />
            </span>
        </button>
    );

    if (!isEnabled || !isHasTab) {
        return null;
    }

    return (
        <div ref={elementRef} className={classes.root}>
            {tabButton}
            {sortElements}
        </div>
    );
};

export default Button;

Button.propTypes = {
    setActiveTab: func,
    activeTab: object
};
