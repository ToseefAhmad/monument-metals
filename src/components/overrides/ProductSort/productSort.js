import { array, arrayOf, shape, string, oneOf } from 'prop-types';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import Icon from '../Icon';

import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';

import defaultClasses from './productSort.module.css';
import ProductSortModal from './productSortModal';

const ProductSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef } = useDropdown();
    const [expanded, setExpanded] = useState(false);
    const MOBILE_SCREEN = 768;
    const { innerWidth } = useWindowSize();
    const isMobile = innerWidth <= MOBILE_SCREEN;

    // Click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        },
        [setSort]
    );

    const sortElements = useMemo(() => {
        // Should be not render item in collapsed mode.

        if (isMobile) {
            return (
                <ProductSortModal
                    expanded={expanded}
                    setExpanded={setExpanded}
                    availableSortMethods={availableSortMethods}
                    sortProps={sortProps}
                />
            );
        } else {
            if (!expanded) {
                return null;
            }
            const itemElements = Array.from(availableSortMethods, sortItem => {
                const { attribute, sortDirection } = sortItem;
                const isActive = currentSort.sortAttribute === attribute && currentSort.sortDirection === sortDirection;

                const key = `${attribute}--${sortDirection}`;

                return (
                    <li key={key} className={classes.menuItem}>
                        <SortItem sortItem={sortItem} active={isActive} onClick={handleItemClick} />
                    </li>
                );
            });
            return (
                <div className={classes.menu}>
                    <ul>{itemElements}</ul>
                </div>
            );
        }
    }, [
        availableSortMethods,
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        expanded,
        handleItemClick,
        isMobile,
        setExpanded,
        sortProps
    ]);

    // Expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // Then close the menu
            if (!isMobile) {
                if (expanded && elementRef.current && !elementRef.current.contains(e.target)) {
                    setExpanded(false);
                }
            }
        };

        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener('click', checkIfClickedOutside);
        };
    }, [elementRef, expanded, isMobile]);

    return (
        <div ref={elementRef} className={classes.root} aria-live="polite" aria-busy="false">
            <Button
                classes={{
                    root_normalPriority: classes.sortButton
                }}
                onClick={handleSortClick}
            >
                <span className={classes.mobileText}>
                    <span>
                        <FormattedMessage id={'productSort.sortButton.mobile'} defaultMessage={'Sort by :'} />
                    </span>
                    <span className={classes.currentSortText}>{currentSort.sortText}</span>
                </span>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <span className={classes.sortTextStatic}>
                            <FormattedMessage id={'productSort.sortByButton.desktop'} defaultMessage={'Sort by :'} />
                        </span>
                        &nbsp;{currentSort.sortText}
                    </span>
                    <Icon
                        src={ArrowDown}
                        classes={{
                            root: classes.desktopIconWrapper,
                            icon: classes.desktopIcon
                        }}
                        size={12}
                    />
                </span>
            </Button>
            {sortElements}
        </div>
    );
};

const sortDirections = oneOf(['ASC', 'DESC']);

ProductSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            text: string,
            id: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortProps: array
};

ProductSort.defaultProps = {
    availableSortMethods: [
        {
            id: 'sortItem.relevance',
            text: 'Best Match',
            attribute: 'relevance',
            sortDirection: 'DESC'
        },
        {
            text: 'Position',
            id: 'sortItem.position',
            attribute: 'position',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.premiumPriceAsc',
            text: 'Premium Price',
            attribute: 'premium_price',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.priceAsc',
            text: 'Price: Low to High',
            attribute: 'price',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.priceDesc',
            text: 'Price: High to Low',
            attribute: 'price',
            sortDirection: 'DESC'
        }
    ]
};

export default ProductSort;
