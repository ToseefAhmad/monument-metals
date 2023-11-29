import { node, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../overrides/Breadcrumbs';

import { Close as IconClose, ArrowLargeRight } from '@app/components/MonumentIcons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './accountPageWrapper.module.css';
import { useAccountPageWrapper } from './useAccountPageWrapper.js';

const ACCOUNT_MENU_ITEMS = [
    {
        name: 'My Profile',
        id: 'accountPageWrapper.account',
        url: '/account-information'
    },
    {
        name: 'My Orders',
        id: 'accountPageWrapper.orders',
        url: '/order-history'
    },
    {
        name: 'Address Book',
        id: 'accountPageWrapper.addressBook',
        url: '/address-book'
    },
    {
        name: 'Newsletter',
        id: 'accountPageWrapper.newsletter',
        url: '/communications'
    },
    {
        name: 'Payment Methods',
        id: 'accountPageWrapper.payment',
        url: '/saved-payments'
    },
    {
        name: 'Alerts',
        id: 'accountPageWrapper.alerts',
        url: '/alerts'
    },
    {
        name: 'Wishlist',
        id: 'accountPageWrapper.wishList',
        url: '/wishlist'
    }
];

const AccountPageWrapper = ({ children, pageTitle }) => {
    const { handleSignOut, pathname } = useAccountPageWrapper();
    const { isMobileScreen, isTabletScreen } = useScreenSize();

    const mobileArrowRigth =
        isMobileScreen || isTabletScreen ? (
            <Icon classes={{ root: classes.iconRightRoot, icon: classes.iconRight }} src={ArrowLargeRight} />
        ) : null;

    useEffect(() => {
        document.body.classList.add('my-account');
        return () => {
            document.body.classList.remove('my-account');
        };
    }, []);
    const accountMenuItems = ACCOUNT_MENU_ITEMS.map(item => {
        return (
            <li key={item.id}>
                <Link
                    className={pathname === item.url ? classes.menuItemActive : classes.menuItem}
                    key={item.name}
                    to={item.url}
                >
                    <FormattedMessage id={item.id} defaultMessage={item.name} />
                    {mobileArrowRigth}
                </Link>
            </li>
        );
    });

    const accountMenu = (
        <ul key={'accountMenu'}>
            {accountMenuItems}
            <li key={'accountPageWrapper.signOut'}>
                <Link onClick={handleSignOut} to="/" className={classes.menuItem}>
                    <FormattedMessage id="accountPageWrapper.signOut" defaultMessage="Sign Out" />
                    {mobileArrowRigth}
                </Link>
            </li>
        </ul>
    );

    const [isActive, setIsActive] = useState(false);
    const accordionContent = isActive ? [accountMenu] : null;
    const closeIcon = isActive ? <Icon src={IconClose} /> : null;

    useEffect(() => {
        if (isTabletScreen) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [isTabletScreen]);

    const maybeAccountMenuModal = (
        <>
            <div className={classes.modalMenuTitleWrapper}>
                <span className={classes.modalMenuTitle}>
                    <FormattedMessage id="accountPageWrapper.menuTitle" defaultMessage="Profile Menu" />
                </span>
                <button className={classes.closeButton} onClick={() => setIsActive(!isActive)}>
                    {closeIcon}
                </button>
            </div>
            {accordionContent}
        </>
    );
    const accountMenuBasedOnScreenSize =
        isMobileScreen && !isTabletScreen ? (
            <div className={!isActive ? classes.menuClosed : null}>
                <button className={classes.menuTitleWrapper} onClick={() => setIsActive(!isActive)}>
                    <span className={classes.menuTitle}>
                        <FormattedMessage id="accountPageWrapper.menuTitle" defaultMessage="Menu" />
                    </span>
                </button>
                <div className={isActive ? classes.menuModal : classes.menuModalClosed}>{maybeAccountMenuModal}</div>
            </div>
        ) : (
            [accountMenu]
        );

    return (
        <div className={classes.root}>
            <Breadcrumbs staticPage={pageTitle} />
            <StoreTitle>{pageTitle}</StoreTitle>
            <h2 className={classes.title}>{pageTitle}</h2>
            <div className={classes.contentWrapper}>
                <div className={classes.AccountMenu}>{accountMenuBasedOnScreenSize}</div>
                <div className={classes.content}>{children}</div>
            </div>
        </div>
    );
};

export default AccountPageWrapper;

AccountPageWrapper.propTypes = {
    children: node,
    pageTitle: string
};
