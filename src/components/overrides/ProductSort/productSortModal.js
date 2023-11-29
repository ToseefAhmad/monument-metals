import { bool, array, func, shape, string } from 'prop-types';
import React, { useCallback, useState } from 'react';
import { FocusScope } from 'react-aria';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';

import defaultClasses from './productSortModal.module.css';

const ProductSortModal = props => {
    const { availableSortMethods, expanded, setExpanded, sortProps } = props;

    const [currentSort, setSort] = sortProps;
    const [currentSortAttribute, setCurrentSortAttribute] = useState(currentSort);

    const handleSortChange = useCallback(() => {
        setSort(currentSortAttribute);
        setExpanded(false);
    }, [currentSortAttribute, setExpanded, setSort]);

    const selectItemClick = useCallback(
        sortAttribute => {
            setCurrentSortAttribute({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
        },
        [setCurrentSortAttribute]
    );

    const closeModal = event => {
        event.stopPropagation();
        setExpanded(false);
    };

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const filtersAriaLabel = formatMessage({
        id: 'sortModal.filters.ariaLabel',
        defaultMessage: 'Sort by'
    });

    const closeAriaLabel = formatMessage({
        id: 'sortModal.sort.close.ariaLabel',
        defaultMessage: 'Close filters popup.'
    });

    const modalClass = expanded ? classes.root_open : classes.root;

    const itemElements = Array.from(availableSortMethods, sortItem => {
        const { attribute, sortDirection } = sortItem;
        const isActive =
            currentSortAttribute.sortAttribute === attribute && currentSortAttribute.sortDirection === sortDirection;

        const key = `${attribute}--${sortDirection}`;
        return (
            <li key={key} className={classes.menuItem}>
                <SortItem sortItem={sortItem} active={isActive} onClick={selectItemClick} />
            </li>
        );
    });

    return (
        <Portal>
            <FocusScope>
                <aside className={modalClass}>
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage id={'sortModal.headerTitle'} defaultMessage={'Sort By'} />
                            </h2>
                            <button onClick={closeModal} aria-disabled={false} aria-label={closeAriaLabel}>
                                <Icon src={CloseIcon} size={32} />
                            </button>
                        </div>
                        <ul className={classes.blocks} aria-label={filtersAriaLabel}>
                            {itemElements}
                        </ul>
                    </div>
                    <div className={classes.applyButtonWrapper}>
                        <Button priority="normal" onClick={handleSortChange}>
                            <FormattedMessage id={'sortModal.applyButtonText'} defaultMessage={'Apply Sorting'} />
                        </Button>
                    </div>
                    <div />
                </aside>
            </FocusScope>
        </Portal>
    );
};
ProductSortModal.propTypes = {
    classes: shape({
        root: string
    }),
    availableSortMethods: array,
    sortProps: array,
    expanded: bool,
    setExpanded: func
};

export default ProductSortModal;
