import { func, shape, string } from 'prop-types';
import React from 'react';

import AccountMenuItems from '@app/components/overrides/AccountMenu/accountMenuItems';
import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/MyAccount/myAccount.module.css';

const MyAccount = props => {
    const { classes: propClasses, onSignOut, onClose } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useMyAccount({
        onSignOut: onSignOut,
        onClose: onClose
    });
    const { handleSignOut } = talonProps;

    return (
        <div className={classes.root}>
            <AccountMenuItems onSignOut={handleSignOut} onClose={onClose} />
        </div>
    );
};

export default MyAccount;

MyAccount.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    }),
    onSignOut: func.isRequired,
    onClose: func.isRequired
};
