import { Form } from 'informed';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import React from 'react';
import { Plus, Minus } from 'react-feather';
import { useIntl } from 'react-intl';

import Icon from '../Icon';

import PriceSlider from '@app/components/PriceSlider';
import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterList from '@magento/venia-ui/lib/components/FilterModal/FilterList';

import defaultClasses from './filterBlock.module.css';

const FilterBlock = props => {
    const { filterApi, filterState, group, items, name, onApply, initialOpen } = props;

    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? Minus : Plus;
    const classes = useStyle(defaultClasses, props.classes);

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by'
        },
        {
            itemName: name
        }
    );

    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show filter item options.'
              },
              {
                  itemName: name
              }
          );

    const list = isExpanded ? (
        group === 'price' ? (
            <PriceSlider items={items} onApply={onApply} filterApi={filterApi} filterState={filterState} />
        ) : (
            <Form className={classes.list}>
                <FilterList
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    items={items}
                    onApply={onApply}
                />
            </Form>
        )
    ) : null;

    const filterCount = filterState ? filterState.size : null;

    return (
        <li className={classes.root} aria-label={itemAriaLabel}>
            <button
                className={classes.trigger}
                onClick={handleClick}
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <div className={classes.category}>
                        <span className={classes.name}>{name}</span>
                        <span className={classes.filterCount}>{filterCount}</span>
                    </div>
                    <Icon src={iconSrc} classes={{ root: classes.icon }} />
                </span>
            </button>
            {list}
        </li>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: bool
};

export default FilterBlock;
