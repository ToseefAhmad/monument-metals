import { bool, func, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { useFilterFooter } from '@magento/peregrine/lib/talons/FilterModal';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './filterFooter.module.css';

const FilterFooter = props => {
    const { applyFilters, hasFilters, isOpen } = props;
    const { formatMessage } = useIntl();
    const { touched } = useFilterFooter({
        hasFilters,
        isOpen
    });

    const classes = useStyle(defaultClasses, props.classes);
    const buttonLabel = formatMessage({
        id: 'filterFooter.results',
        defaultMessage: 'Apply Filters'
    });

    return (
        <div className={classes.root}>
            <Button
                disabled={!touched}
                onClick={applyFilters}
                aria-label={buttonLabel}
                aria-disabled={!touched}
                priority="normal"
            >
                {buttonLabel}
            </Button>
        </div>
    );
};

FilterFooter.propTypes = {
    applyFilters: func.isRequired,
    classes: shape({
        root: string
    }),
    hasFilters: bool,
    isOpen: bool
};

export default FilterFooter;
