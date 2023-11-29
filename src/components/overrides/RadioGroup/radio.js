import classnames from 'classnames';
import { Radio as InformedRadio } from 'informed';
import { node, shape, string, bool } from 'prop-types';
import React from 'react';
import { Circle } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './radio.module.css';

const RadioOption = props => {
    const { classes: propClasses, id, label, value, active, icon, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <label className={classnames({ [classes.root]: !active, [classes.root_active]: active })} htmlFor={id}>
            <InformedRadio {...rest} className={classes.input} id={id} value={value} />
            <span className={classes.icon}>
                <Icon src={Circle} size={16} classes={{ root: classes.iconRoot, icon: classes.iconSvg }} />
            </span>
            <span className={classes.label}>
                {icon && <span className={classes.labelIcon}>{icon}</span>}
                {label || (value != null ? value : '')}
            </span>
        </label>
    );
};

export default RadioOption;

RadioOption.propTypes = {
    classes: shape({
        icon: string,
        input: string,
        label: string,
        root: string,
        root_active: string
    }),
    active: bool,
    id: string.isRequired,
    label: node.isRequired,
    value: node.isRequired,
    icon: node
};
