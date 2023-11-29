import { array, arrayOf, shape, string, number, bool } from 'prop-types';
import React, { useMemo, useCallback, useRef } from 'react';
import { Trash2 as Remove } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import CurrentFilters from '../FilterModal/CurrentFilters';
import Icon from '../Icon';
import LinkButton from '../LinkButton';

import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar/useFilterSidebar.js';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterBlock from '@magento/venia-ui/lib/components/FilterModal/filterBlock';

import defaultClasses from './filterSidebar.module.css';

const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterSidebar = props => {
    const { filters, isOpen, filterCountToOpen } = props; // FilterCountToOpen
    const talonProps = useFilterSidebar({ filters });
    const { filterApi, filterItems, filterNames, filterState, handleApply, handleReset } = talonProps;

    const filterRef = useRef();
    const classes = useStyle(defaultClasses, props.classes);

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (filterElement && typeof filterElement.getBoundingClientRect === 'function') {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY = window.scrollY + filterTop - SCROLL_OFFSET;
                window.scrollTo(0, windowScrollY);
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                // Iteration
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                        onApply={handleApplyFilter}
                        initialOpen={iteration < filterCountToOpen} // Iteration < filterCountToOpen
                    />
                );
            }),
        [filterItems, filterState, filterNames, filterApi, handleApplyFilter, filterCountToOpen] // FilterCountToOpen
    );

    const clearAll = filterState.size ? (
        <div className={classes.removeAllFiltersWrapper}>
            <LinkButton type="button" onClick={handleReset} classes={{ root: classes.removeAllFiltersButton }}>
                <div className={classes.verticalLine + ' ' + classes.leftLine} />
                <Icon classes={{ icon: classes.removeIcon }} size={16} src={Remove} />
                <FormattedMessage id={'filterModal.action'} defaultMessage={'Remove all filters'} />
                <div className={classes.verticalLine + ' ' + classes.rightLine} />
            </LinkButton>
        </div>
    ) : null;

    if (!isOpen) {
        return null;
    }
    return (
        <aside className={classes.root} ref={filterRef} aria-live="polite" aria-busy="false">
            <div className={classes.body}>
                <div className={classes.currentFilters}>
                    <CurrentFilters
                        filterApi={filterApi}
                        filterNames={filterNames}
                        filterState={filterState}
                        onRemove={handleApplyFilter}
                    />
                    {clearAll}
                </div>
                <ul className={classes.blocks}>{filtersList}</ul>
            </div>
        </aside>
    );
};

FilterSidebar.defaultProps = {
    filterCountToOpen: 3
};

FilterSidebar.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    ),
    filterCountToOpen: number,
    isOpen: bool
};

export default FilterSidebar;
