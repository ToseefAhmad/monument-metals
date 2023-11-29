import { bool, node, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './field.module.css';

const Field = props => {
    const { children, id, label, optional } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const optionalSymbol = !optional ? <span className={classes.optional}>*</span> : null;

    return (
        <div className={classes.root}>
            {label && (
                <label className={classes.label} htmlFor={id}>
                    {label}
                    {optionalSymbol}
                </label>
            )}
            {children}
        </div>
    );
};

Field.propTypes = {
    children: node,
    classes: shape({
        label: string,
        root: string
    }),
    id: string,
    label: node,
    optional: bool
};

export default Field;
