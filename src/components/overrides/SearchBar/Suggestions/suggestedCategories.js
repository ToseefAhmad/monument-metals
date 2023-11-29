import classnames from 'classnames';
import { arrayOf, func, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './suggestedCategories.module.css';
import SuggestedCategory from './suggestedCategory';

const SuggestedCategories = props => {
    const { categories, limit, closeSearchBar, onNavigate } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const items = categories.slice(0, limit).map(({ label, value: categoryId, url }) => (
        <li key={categoryId} className={classes.item}>
            <SuggestedCategory onClick={closeSearchBar} onNavigate={onNavigate} label={label} url={url} />
        </li>
    ));

    return (
        <div className={classnames({ [classes.root]: true, [classes.rootEmpty]: !items.length })}>
            <div className={classes.header}>
                <p>
                    <FormattedMessage id={'suggestedCategories.title'} defaultMessage={'Categories'} />
                </p>
            </div>
            <ul className={classes.items}>{items}</ul>
        </div>
    );
};

SuggestedCategories.defaultProps = {
    limit: 4
};

SuggestedCategories.propTypes = {
    categories: arrayOf(
        shape({
            label: string.isRequired,
            value: string.isRequired
        })
    ).isRequired,
    classes: shape({
        item: string,
        root: string
    }),
    limit: number.isRequired,
    closeSearchBar: func.isRequired,
    onNavigate: func
};

export default SuggestedCategories;
