import classnames from 'classnames';
import React, { Suspense, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useXsearchHeader } from '@app/components/AdvancedSearch';
import { PriceBar } from '@app/components/MetalMarket';
import Notification from '@app/components/Notification/notification';
import { useNotification } from '@app/components/Notification/useNotification';
import SearchBar from '@app/components/overrides/SearchBar';
import { usePostHog } from '@app/components/PostHog/usePostHog';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import PageLoadingIndicator from '@magento/venia-ui/lib/components//PageLoadingIndicator';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import Logo from '@magento/venia-ui/lib/components/Logo';

import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import classes from './header.module.css';
import { MenuShimmer } from './Menu';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import { useHeader } from './useHeader';

const Navigation = React.lazy(() =>
    import(/* webpackChunkName: "navigation" */ '@app/components/overrides/Navigation')
);
const Menu = React.lazy(() => import(/* webpackChunkName: "menu" */ './Menu'));

const Header = () => {
    const topBarRef = useRef(null);

    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        isSearchVisible,
        isScrolled,
        searchRef,
        searchTriggerRef,
        closeSearchBar
    } = useHeader({ topBarRef });

    usePostHog();

    const { styles } = useXsearchHeader();
    const { isMobileScreen, isDesktopScreen } = useScreenSize();
    const { notificationActive, notificationData } = useNotification();
    const [{ drawer }] = useAppContext();

    useScrollLock(drawer === 'nav');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const searchBar = (
        <SearchBar
            isOpen={isSearchOpen}
            isVisible={isSearchVisible}
            ref={searchRef}
            classes={{ root_open: classes.searchOpen }}
            closeSearchBar={closeSearchBar}
        />
    );

    return (
        <>
            <Notification {...notificationData} />
            <PriceBar hasNotification={notificationActive} />
            <div ref={topBarRef} className={classes.topBarWrapper}>
                <CmsBlock identifiers={'header-store-information'} classes={{ root: classes.topHeaderContacts }} />
            </div>
            <header
                className={classnames({
                    [classes.root]: !isScrolled,
                    [classes.root_scrolled]: isScrolled,
                    [classes.notification]: notificationActive
                })}
                style={styles}
            >
                <div className={classes.mainWrapper}>
                    <div className={classes.mainContainer}>
                        {isMobileScreen && (
                            <div className={classnames(classes.primaryActions, classes.navTrigger)}>
                                <NavTrigger />
                            </div>
                        )}
                        <OnlineIndicator hasBeenOffline={hasBeenOffline} isOnline={isOnline} />
                        <Link to={resourceUrl('/')} className={classes.logoContainer}>
                            <Logo />
                        </Link>
                        {searchBar}
                        <div className={classes.secondaryActions}>
                            <SearchTrigger onClick={handleSearchTriggerClick} ref={searchTriggerRef} />
                            {isDesktopScreen && <AccountTrigger />}
                            <div className={classes.cartTrigger}>
                                <CartTrigger />
                            </div>
                        </div>
                    </div>
                </div>
                <PageLoadingIndicator absolute />
            </header>
            {isDesktopScreen && (
                <Suspense fallback={<MenuShimmer />}>
                    <div className={classes.menuWrapper}>
                        <div className={classes.menuContainer}>
                            <Menu identifier={'menu'} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                        </div>
                    </div>
                </Suspense>
            )}
            {isMobileScreen && (
                <Suspense fallback={null}>
                    <Navigation />
                </Suspense>
            )}
        </>
    );
};

Header.displayName = 'Header';

export default Header;
