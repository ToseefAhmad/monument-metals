import { func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './suggestedCategory.module.css';

const SuggestedCategory = props => {
    const { label, url, onClick, onNavigate } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
            onClick && onClick();
        }
    }, [onNavigate, onClick]);

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Link onClick={handleClick} className={classes.root} to={url}>
            <p className={classes.label}>{label}</p>
        </Link>
    );
};

export default SuggestedCategory;

SuggestedCategory.propTypes = {
    classes: shape({
        label: string,
        root: string,
        value: string
    }),
    label: string.isRequired,
    onClick: func,
    url: string,
    onNavigate: func
};
