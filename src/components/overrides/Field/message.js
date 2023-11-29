import { node, number, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './message.module.css';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { formatMessage } = useIntl();
    const { error } = fieldState;

    const classes = useStyle(defaultClasses, propClasses);
    const className = error ? classes.root_error : classes.root;
    let translatedErrorMessage;
    let errorIcon;

    if (error) {
        translatedErrorMessage = formatMessage(
            {
                id: error.id,
                defaultMessage: error.defaultMessage
            },
            { value: error.value }
        );

        errorIcon = (
            <span className={classes.errorIcon}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM7 9C7 9.55229 6.55228 10 6 10C5.44772 10 5 9.55229 5 9C5 8.44771 5.44772 8 6 8C6.55228 8 7 8.44771 7 9ZM6 2C5.44772 2 5 2.44772 5 3V6C5 6.55228 5.44772 7 6 7C6.55228 7 7 6.55228 7 6V3C7 2.44772 6.55228 2 6 2Z"
                        fill="#B22234"
                    />
                </svg>
            </span>
        );
    }

    return (
        <p className={className}>
            {errorIcon}
            {translatedErrorMessage || children}
        </p>
    );
};

export default Message;

Message.defaultProps = {
    fieldState: {}
};

Message.propTypes = {
    children: node,
    classes: shape({
        root: string,
        root_error: string
    }),
    fieldState: shape({
        error: shape({
            id: string,
            defaultMessage: string,
            value: oneOfType([number, string])
        })
    })
};
