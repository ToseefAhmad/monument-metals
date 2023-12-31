import { func, bool, object } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './mask.module.css';

/**
 * A component that masks content.
 *
 * @param {props} props React component props
 * @param {Object} props.classes - CSS classes to override element styles.
 * @param {callback} props.dismiss Handler for the onClick() event
 * @param {callback} props.isActive True if the mask is in an active state. False otherwise.
 * @returns {React.Element} A React component that will mask content.
 *
 */
const Mask = props => {
    const { dismiss, isActive } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const className = isActive ? classes.root_active : classes.root;

    return <button className={className} onClick={dismiss} />;
};

Mask.propTypes = {
    classes: object,
    dismiss: func,
    isActive: bool
};

export default Mask;
