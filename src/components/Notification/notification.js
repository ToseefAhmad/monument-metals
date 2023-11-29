import classnames from 'classnames';
import { bool, string } from 'prop-types';
import React from 'react';

import classes from '@app/components/Notification/notification.module.css';
import { useScreenSize } from '@app/hooks/useScreenSize';

const Notification = ({ active, mode, message, link }) => {
    const { isMobileScreen } = useScreenSize();

    if (!active) {
        return null;
    }

    if (link) {
        return (
            <div className={classnames(classes.notificationContainer, classes[mode])}>
                <div className={classes.message}>
                    <a href={link}>
                        <p
                            className={classnames({
                                [classes.text]: true,
                                [classes.textMobile]: isMobileScreen
                            })}
                        >
                            {message}
                        </p>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={classnames(classes.notificationContainer, classes[mode])}>
            <div className={classes.message}>
                <p>{message}</p>
            </div>
        </div>
    );
};

Notification.propTypes = {
    active: bool,
    mode: string,
    message: string,
    link: string
};

export default Notification;
