import classnames from 'classnames';
import { bool, object, string, func } from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import { ArrowRight } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';
import { useHoverDropdown } from '@app/hooks/useHoverDropdown';

import classes from './menu.module.css';
import MenuShimmer from './menu.shimmer';
import { useMenu } from './useMenu';

const Dropdown = ({ rootItem, childItems, showDropdown, setIsDelayedOpenDone, delayedMenuOpen }) => {
    const { elementRef, triggerRef, expanded, setExpanded } = useHoverDropdown(0);
    const location = useLocation();

    const handleOverlayMouseOver = event => {
        event.stopPropagation();
        setExpanded(false);
        setIsDelayedOpenDone(false);
    };

    const handleMenuMouseOver = () => {
        triggerRef.current.setAttribute('hover', 'true');
        delayedMenuOpen(() => {
            setExpanded(true);
        }, triggerRef);
    };

    const handleMouseLeave = () => {
        triggerRef.current.removeAttribute('hover');
    };

    useEffect(() => {
        setExpanded(false);
        setIsDelayedOpenDone(false);
    }, [location, setExpanded, setIsDelayedOpenDone]);

    // Generate dropdown items
    const items =
        childItems[rootItem.item_id] &&
        childItems[rootItem.item_id].map(childItem => (
            // Render child items of root
            <div className={classes.firstChildItemWrapper} key={childItem.item_id}>
                <Link className={classes.firstChildItem} to={childItem.url} underline="never">
                    {childItem.title}
                </Link>
                <ul>
                    {childItems[childItem.item_id] &&
                        childItems[childItem.item_id].slice(0, 3).map(childItem => {
                            // Render child items of parent items (root first children)
                            return (
                                <li key={childItem.item_id}>
                                    <Link className={classes.secondChildItem} to={childItem.url} underline="never">
                                        {childItem.title}
                                    </Link>
                                </li>
                            );
                        })}
                    {childItems[childItem.item_id] && childItems[childItem.item_id].length > 3 && (
                        <Link to={childItem.url} underline="never" className={classes.viewAllWithArrow}>
                            <span className={classes.viewAll}>
                                <FormattedMessage id={'menu.viewAll'} defaultMessage={'View all'} />
                            </span>
                            <Icon classes={{ root: classes.viewAllIcon }} src={ArrowRight} />
                        </Link>
                    )}
                </ul>
            </div>
        ));

    return (
        <li
            ref={triggerRef}
            className={classnames(classes.title, { [classes.hover]: expanded })}
            onMouseOver={handleMenuMouseOver}
            onMouseLeave={handleMouseLeave}
            data-key={rootItem.url}
            onFocus={() => {}}
        >
            <Link className={classes.menuLink} to={rootItem.url} underline="never">
                <span className={classes.dropdownTrigger}>{rootItem.title}</span>
            </Link>
            {showDropdown && (
                <aside className={classes.dropdown} ref={elementRef}>
                    <div className={classes.dropdownContentWrapper}>
                        <div className={classes.dropdownContent}>
                            <div className={classes.items}>{items}</div>
                        </div>
                    </div>
                    <div onFocus={() => {}} onMouseOver={handleOverlayMouseOver} className={classes.overlay} />
                </aside>
            )}
        </li>
    );
};

Dropdown.propTypes = {
    rootItem: object,
    childItems: object,
    showDropdown: bool,
    setIsDelayedOpenDone: func.isRequired,
    delayedMenuOpen: func.isRequired
};

const Menu = ({ identifier }) => {
    const { loading, rootItems, childItems, hasChildren } = useMenu({ identifier });
    const [isDelayedOpenDone, setIsDelayedOpenDone] = useState(false);
    const ref = useRef(null);

    const delayedMenuOpen = (callback, triggerRef) => {
        if (!isDelayedOpenDone) {
            setTimeout(() => {
                if (ref?.current?.hasAttribute('hover')) {
                    setIsDelayedOpenDone(true);

                    if (triggerRef.current.hasAttribute('hover')) {
                        callback();
                    }
                }
            }, [500]);
        } else {
            callback();
        }
    };

    const handleMouseOver = () => {
        ref.current.setAttribute('hover', 'true');
    };

    const handleMouseLeave = () => {
        ref.current.removeAttribute('hover');
        setIsDelayedOpenDone(false);
    };

    /**
     * Return empty span instead of null to have a DOM element
     * so layout wouldn't change and position for Search would stay the same
     */
    if (!rootItems.length) {
        if (loading) {
            return <MenuShimmer />;
        }

        return <span />;
    }

    return (
        <ul
            className={classes.root}
            ref={ref}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onFocus={() => {}}
        >
            {rootItems.map(rootItem => {
                return (
                    <Dropdown
                        key={`menu-item-${rootItem.item_id}`}
                        rootItem={rootItem}
                        childItems={childItems}
                        showDropdown={hasChildren(rootItem)}
                        setIsDelayedOpenDone={setIsDelayedOpenDone}
                        delayedMenuOpen={delayedMenuOpen}
                    />
                );
            })}
        </ul>
    );
};

Menu.propTypes = {
    identifier: string.isRequired
};

export default Menu;
