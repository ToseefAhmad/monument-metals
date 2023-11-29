import classnames from 'classnames';
import React from 'react';

import {
    ArrowLargeLeft,
    ArrowLargeRight,
    ArrowLeft,
    ArrowRight,
    Breadcrumb,
    Calendar,
    Cart,
    Close,
    Delete,
    DropdownUpLarge,
    DropdownDownLarge,
    Dropdown,
    Edit,
    Facebook,
    Grid,
    Hamburger,
    Instagram,
    List,
    Mail,
    Maximize,
    Minimize,
    Minus,
    Phone,
    Pin,
    Plus,
    PriceDown,
    PriceUp,
    Profile,
    Reddit,
    Remove,
    Shipping,
    Search,
    Twitter,
    ZoomIn,
    CreditCard,
    Echeck,
    Paypal,
    WireTransfer,
    Check,
    AmericanExpressLight,
    WireTransferLight,
    VisaLight,
    PaypalLight,
    MastercardLight,
    EcheckLight,
    DiscoverLight,
    ShoppingCart
} from '@app/components/MonumentIcons';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './iconsSection.module.css';

const IconsSection = () => {
    const iconsList = [
        {
            component: Profile
        },
        {
            component: Cart
        },
        {
            component: Phone
        },
        {
            component: Calendar
        },
        {
            component: Shipping
        },
        {
            component: PriceDown
        },
        {
            component: PriceUp
        },
        {
            component: Search
        },
        {
            component: Dropdown
        },
        {
            component: ArrowLeft
        },
        {
            component: ArrowRight
        },
        {
            component: Plus
        },
        {
            component: Minus
        },
        {
            component: Pin
        },
        {
            component: Mail
        },
        {
            component: Maximize
        },
        {
            component: Minimize
        },
        {
            component: Remove
        },
        {
            component: Delete
        },
        {
            component: Breadcrumb
        },
        {
            component: Edit
        },
        {
            component: DropdownUpLarge
        },
        {
            component: DropdownDownLarge
        },
        {
            component: CreditCard
        },
        {
            component: Paypal
        },
        {
            component: Echeck
        },
        {
            component: Check
        },
        {
            component: WireTransfer
        },
        {
            component: Hamburger
        },
        {
            component: Close
        },
        {
            component: Facebook,
            dark: true
        },
        {
            component: Instagram,
            dark: true
        },
        {
            component: Twitter,
            dark: true
        },
        {
            component: Reddit,
            dark: true
        },
        {
            component: Grid,
            dark: true
        },
        {
            component: List,
            dark: true
        },
        {
            component: ArrowLargeLeft,
            dark: true
        },
        {
            component: ArrowLargeRight,
            dark: true
        },
        {
            component: ZoomIn,
            dark: true
        },
        {
            component: List,
            dark: true
        },
        { component: VisaLight, dark: true },
        { component: PaypalLight, dark: true },
        { component: MastercardLight, dark: true },
        { component: DiscoverLight, dark: true },
        { component: AmericanExpressLight, dark: true },
        { component: WireTransferLight, dark: true },
        { component: EcheckLight, dark: true }
    ];

    return (
        <div className={classes.root}>
            <div className={classes.list}>
                {iconsList.map((icon, index) => (
                    <div className={classes.item} key={index}>
                        <div
                            className={classnames({
                                [classes.badge]: true,
                                [classes.badgeLight]: !icon.dark,
                                [classes.badgeDark]: icon.dark
                            })}
                        >
                            <Icon src={icon.component} />
                        </div>
                    </div>
                ))}
            </div>
            <div className={classes.list}>
                <div className={classes.item}>
                    <div className={classes.badgeLightLarge}>
                        <Icon src={ShoppingCart} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IconsSection;
