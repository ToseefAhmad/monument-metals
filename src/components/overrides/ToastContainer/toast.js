import classnames from 'classnames';
import { bool, node, func, string, number, oneOfType } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './toast.module.css';

const Toast = ({ dismissable, icon, message, onDismiss, handleDismiss, type, timeout }) => {
    const iconElement = useMemo(() => {
        if (icon) {
            return icon;
        }
    }, [icon]);

    const controls =
        onDismiss || dismissable ? (
            <button className={classes.dismissButton} onClick={handleDismiss}>
                <FormattedMessage id="toast.close" defaultMessage="Close" />
            </button>
        ) : null;

    return (
        <div className={classnames(classes.root, classes[`${type}Toast`])}>
            <div className={classes.container}>
                <div className={classes.messageContainer}>
                    {iconElement}
                    <div className={classes.message}>{message}</div>
                </div>
                <div className={classes.controls}>{controls}</div>
            </div>
            {timeout && <div className={classes.progress} style={{ animationDuration: `${timeout}ms` }} />}
        </div>
    );
};

Toast.propTypes = {
    dismissable: bool,
    icon: node,
    message: string,
    onDismiss: func,
    handleDismiss: func,
    type: string,
    timeout: oneOfType([number, bool])
};

Toast.defaultProps = {
    dismissable: true
};

export default Toast;
