import { Checkbox as InformedCheckbox, useFieldApi } from 'informed';
import { node, shape, string, bool } from 'prop-types';
import React, { useEffect } from 'react';
import { Square } from 'react-feather';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './checkbox.module.css';

const Checkbox = ({ ariaLabel, classes: propClasses, field, fieldValue, id, label, message, dark, ...rest }) => {
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);

    const rootClass = fieldState.error ? classes.root_error : classes.root;
    const iconClass = dark ? classes.iconDark : classes.icon;
    const squareIconClass = fieldState.error ? classes.icon_error : iconClass;

    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);

    return (
        <div>
            <div className={classes.messageWrapper}>
                <Message fieldState={fieldState}>{message}</Message>
            </div>
            <label aria-label={ariaLabel} className={rootClass} htmlFor={id}>
                <InformedCheckbox {...rest} className={classes.input} field={field} id={id} />
                <span className={classes.iconWrapper}>
                    <span className={squareIconClass}>
                        <Icon src={Square} size={20} />
                    </span>
                    <span className={classes.iconMark}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L3.70711 7.70711C3.31658 8.09763 2.68342 8.09763 2.29289 7.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L3 5.58579L8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893Z"
                                fill="white"
                            />
                        </svg>
                    </span>
                </span>
                <span className={classes.label}>{label}</span>
            </label>
        </div>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        icon_error: string,
        input: string,
        label: string,
        message: string,
        root: string,
        root_error: string
    }),
    dark: bool,
    fieldValue: bool,
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};
