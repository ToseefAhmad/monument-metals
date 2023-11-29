import classnames from 'classnames';
import { shape, string } from 'prop-types';
import React from 'react';

import PriceBarShimmer from '@app/components/MetalMarket/priceBarShimmer';
import notificationClasses from '@app/components/Notification/notification.module.css';
import accountChipClasses from '@app/components/overrides/AccountChip/accountChip.module.css';
import { MenuShimmer } from '@app/components/overrides/Header/Menu';
import pageLoadingIndicatorClasses from '@app/components/overrides/PageLoadingIndicator/pageLoadingIndicator.module.css';
import searchBarClasses from '@app/components/overrides/SearchBar/searchBar.module.css';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import accountTriggerClasses from './accountTrigger.module.css';
import cartTriggerClasses from './cartTrigger.module.css';
import defaultClasses from './header.module.css';
import navTriggerClasses from './navTrigger.module.css';
import searchTriggerClasses from './searchTrigger.module.css';

const HeaderShimmer = props => {
    const classes = useStyle(
        defaultClasses,
        {
            notificationRoot: notificationClasses.notificationContainer,
            navTriggerRoot: navTriggerClasses.root,
            searchTriggerRoot: searchTriggerClasses.root,
            searchBarSearch: searchBarClasses.search,
            cartTriggerLink: cartTriggerClasses.link,
            cartTriggerContainer: cartTriggerClasses.triggerContainer,
            cartTriggerTrigger: cartTriggerClasses.trigger,
            cartTriggerCart: cartTriggerClasses.cart,
            accountTriggerRoot: accountTriggerClasses.root,
            accountTriggerTrigger: accountTriggerClasses.trigger,
            accountChipRoot: accountChipClasses.root,
            pageLoadingIndicatorRoot: pageLoadingIndicatorClasses.root_absolute,
            pageLoadingIndicatorLoading: pageLoadingIndicatorClasses.indicator_loading
        },
        props.classes
    );
    const { isMobileScreen, isDesktopScreen } = useScreenSize();
    const hasNotificationBar = globalThis?.__STORE_CONFIG__?.notification_active;

    return (
        <>
            {hasNotificationBar && (
                <div className={classes.notificationRoot}>
                    <Shimmer width={'100%'} height={'100%'} />
                </div>
            )}
            <PriceBarShimmer hasNotification={hasNotificationBar} />
            <div className={classes.topBarWrapper_shimmer}>
                <Shimmer width={'100%'} height={'auto'} />
            </div>
            <header
                className={classnames({
                    [classes.root]: true,
                    [classes.notification]: hasNotificationBar
                })}
            >
                <div className={classes.mainWrapper}>
                    <div className={classes.mainContainer}>
                        {isMobileScreen && (
                            <div className={classnames(classes.primaryActions, classes.navTrigger)}>
                                <div className={classes.navTriggerRoot}>
                                    <Shimmer width={1} height={1} />
                                </div>
                            </div>
                        )}
                        <div className={classes.logoContainer}>
                            <Shimmer
                                width={isMobileScreen ? '112px' : '240px'}
                                height={isMobileScreen ? 2 : 4}
                                style={{
                                    verticalAlign: 'top'
                                }}
                            />
                        </div>

                        {isDesktopScreen && (
                            <div className={classes.searchOpen}>
                                <div className={classes.searchBarSearch}>
                                    <Shimmer
                                        width={'100%'}
                                        height={'50px'}
                                        style={{
                                            verticalAlign: 'top'
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={classes.secondaryActions}>
                            <div className={classes.searchTriggerRoot}>
                                <Shimmer width={1} height={1} />
                            </div>

                            {isDesktopScreen && (
                                <div className={classes.accountTriggerRoot}>
                                    <div className={classes.accountTriggerTrigger}>
                                        <div className={classes.accountChipRoot}>
                                            <Shimmer width={'140px'} height={'50px'} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={classes.cartTrigger}>
                                <div className={classes.cartTriggerContainer}>
                                    <div className={classes.cartTriggerTrigger}>
                                        <div className={classes.cartTriggerCart}>
                                            <Shimmer width={'135px'} height={'50px'} />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.cartTriggerLink}>
                                    <Shimmer width={1} height={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.pageLoadingIndicatorRoot} />
            </header>
            {isDesktopScreen && (
                <div className={classes.menuWrapper}>
                    <div className={classes.menuContainer}>
                        <MenuShimmer />
                    </div>
                </div>
            )}
        </>
    );
};

HeaderShimmer.propTypes = {
    classes: shape({
        notificationRoot: string,
        topBarWrapper_shimmer: string,
        mainWrapper: string,
        root: string,
        notification: string,
        navTriggerShimmer: string,
        mainContainer: string,
        logoContainer: string
    })
};

export default HeaderShimmer;
