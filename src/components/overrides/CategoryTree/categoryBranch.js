import { func, number, shape, string } from 'prop-types';
import React from 'react';

import { ArrowLargeRight } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './categoryBranch.module.css';
import { useCategoryBranch } from './useCategoryBranch.js';

const Branch = props => {
    const { category, setCategoryId } = props;
    const { name } = category;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useCategoryBranch({ category, setCategoryId });
    const { exclude, handleClick } = talonProps;

    if (exclude) {
        return null;
    }

    return (
        <li className={classes.root}>
            <button className={classes.target} type="button" onClick={handleClick}>
                <span className={classes.text}>{name}</span>
                <Icon classes={{ icon: classes.icon }} src={ArrowLargeRight} />
            </button>
        </li>
    );
};

export default Branch;

Branch.propTypes = {
    category: shape({
        id: string.isRequired,
        include_in_menu: number,
        name: string.isRequired
    }).isRequired,
    classes: shape({
        root: string,
        target: string,
        text: string
    }),
    setCategoryId: func.isRequired
};
