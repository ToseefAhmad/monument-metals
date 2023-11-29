import { shape, string, array, func } from 'prop-types';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useFilterModal } from '@app/components/overrides/FilterModal/useFilterModal';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './filterModalOpenButton.module.css';

const FilterModalOpenButton = props => {
    const { filters, toggleAction, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const { isMobileScreen } = useScreenSize();
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

    const talonProps = useFilterModal({ filters });
    const { filterState, handleOpen } = talonProps;

    let priority = 'normal';
    let counter = null;
    filterState.forEach(value => {
        counter += value.size;
    });

    const handleOpenFilters = useCallback(() => {
        if (isMobileScreen) {
            handleOpen();
        } else {
            toggleAction();
            setIsOpenSidebar(!isOpenSidebar);
        }
    }, [isMobileScreen, handleOpen, toggleAction, isOpenSidebar]);

    let filterButtonText = isOpenSidebar ? (
        <FormattedMessage id={'productList.filterClose'} defaultMessage={'Hide Filters'} />
    ) : (
        <FormattedMessage id={'productList.filterOpen'} defaultMessage={'Show Filters'} />
    );
    if (isMobileScreen) {
        priority = 'low';
        filterButtonText = (
            <span>
                <FormattedMessage id={'productList.filter'} defaultMessage={'Filters'} />
                <span className={classes.counter}>{counter}</span>
            </span>
        );
    }

    return (
        <div className={classes.root}>
            <Button priority={priority} onClick={handleOpenFilters} type="button" aria-live="polite" aria-busy="false">
                {filterButtonText}
            </Button>
        </div>
    );
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
    classes: shape({
        filterButton: string
    }),
    toggleAction: func,
    filters: array
};
