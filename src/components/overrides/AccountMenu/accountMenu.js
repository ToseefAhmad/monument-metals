import { shape, string } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';

import SignIn from '@app/components/overrides/SignIn';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './accountMenu.module.css';
import AccountMenuItems from './accountMenuItems';
import { useAccountMenu } from './useAccountMenu';

const AccountMenu = React.forwardRef((props, ref) => {
    const {
        accountMenuView,
        username,
        handleAccountCreation,
        handleSignOut,
        handleForgotPassword,
        handleCancel,
        handleClose,
        handleCreateAccount,
        updateUsername,
        isAccountMenuOpen
    } = useAccountMenu({});

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isAccountMenuOpen ? classes.root_open : classes.root;
    const contentsClass = isAccountMenuOpen ? classes.contents_open : classes.contents;

    let dropdownContents = null;

    switch (accountMenuView) {
        case 'ACCOUNT': {
            dropdownContents = <AccountMenuItems onSignOut={handleSignOut} />;

            break;
        }
        case 'FORGOT_PASSWORD': {
            dropdownContents = <ForgotPassword initialValues={{ email: username }} onCancel={handleCancel} />;

            break;
        }
        case 'CREATE_ACCOUNT': {
            dropdownContents = (
                <CreateAccount
                    classes={{ root: classes.createAccount }}
                    initialValues={{ email: username }}
                    isCancelButtonHidden={false}
                    onSubmit={handleAccountCreation}
                    onCancel={handleCancel}
                />
            );

            break;
        }
        case 'SIGNIN':
        default: {
            dropdownContents = (
                <SignIn
                    classes={{
                        modal_active: classes.loading
                    }}
                    setDefaultUsername={updateUsername}
                    showCreateAccount={handleCreateAccount}
                    showForgotPassword={handleForgotPassword}
                />
            );

            break;
        }
    }

    return (
        <aside className={rootClass}>
            <div ref={ref} className={contentsClass}>
                <button className={classes.closeIcon} onClick={handleClose}>
                    <Icon size={32} src={CloseIcon} />
                </button>
                {isAccountMenuOpen ? dropdownContents : null}
            </div>
        </aside>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        link: string,
        contents_open: string,
        contents: string
    })
};
