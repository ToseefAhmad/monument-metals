import { array, arrayOf, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FocusScope } from 'react-aria';
import { X as CloseIcon, Trash2 as Remove } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Icon from '@app/components/overrides/Icon';
import LinkButton from '@app/components/overrides/LinkButton';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import FilterBlock from './filterBlock';
import FilterFooter from './filterFooter';
import defaultClasses from './filterModal.module.css';
import { useFilterModal } from './useFilterModal';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const { formatMessage } = useIntl();
    const talonProps = useFilterModal({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        handleKeyDownActions,
        isOpen
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;
    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items]) => {
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
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState]
    );

    const filtersAriaLabel = formatMessage({
        id: 'filterModal.filters.ariaLabel',
        defaultMessage: 'Filters'
    });

    const closeAriaLabel = formatMessage({
        id: 'filterModal.filters.close.ariaLabel',
        defaultMessage: 'Close filters popup.'
    });

    const clearAllAriaLabel = formatMessage({
        id: 'filterModal.action.clearAll.ariaLabel',
        defaultMessage: 'Clear all applied filters'
    });

    const clearAll = filterState.size ? (
        <div className={classes.removeAllFiltersWrapper}>
            <LinkButton
                type="button"
                onClick={handleReset}
                ariaLabel={clearAllAriaLabel}
                classes={{ root: classes.removeAllFiltersButton }}
            >
                <Icon classes={{ icon: classes.removeIcon }} size={16} src={Remove} />
                <FormattedMessage id={'filterModal.action'} defaultMessage={'Remove all filters'} />
            </LinkButton>
        </div>
    ) : null;

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain restoreFocus autoFocus>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside className={modalClass} onKeyDown={handleKeyDownActions}>
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage id={'filterModal.headerTitle'} defaultMessage={'Filters'} />
                            </h2>
                            <button onClick={handleClose} aria-disabled={false} aria-label={closeAriaLabel}>
                                <Icon src={CloseIcon} size={32} />
                            </button>
                        </div>
                        <ul className={classes.blocks} aria-label={filtersAriaLabel}>
                            {filtersList}
                        </ul>
                    </div>
                    {clearAll}
                    <FilterFooter applyFilters={handleApply} hasFilters={!!filterState.size} isOpen={isOpen} />
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
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
    )
};

export default FilterModal;
