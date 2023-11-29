import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from './accountMenuItems.module.css';
import { useAccountMenuItems } from './useAccountMenuItems';

const AccountMenuItems = ({ onSignOut, onClose }) => {
    const { handleSignOut, menuItems } = useAccountMenuItems({ onSignOut });

    const menu = menuItems.map(item => {
        return (
            <Link className={classes.link} key={item.name} to={item.url} onClick={onClose}>
                <FormattedMessage id={item.id} defaultMessage={item.name} />
            </Link>
        );
    });

    return (
        <div className={classes.root}>
            {menu}
            <button className={classes.signOut} onClick={handleSignOut} type="button">
                <FormattedMessage id={'accountMenu.signOutButtonText'} defaultMessage={'Sign Out'} />
            </button>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onSignOut: func,
    onClose: func
};
