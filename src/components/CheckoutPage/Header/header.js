import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { ArrowLeft } from '@app/components/MonumentIcons';
import { usePostHog } from '@app/components/PostHog/usePostHog';
import Countdown from '@app/components/PriceFreeze';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Logo from '@magento/venia-ui/lib/components/Logo';

import classes from './header.module.css';

const Header = () => {
    const { isOrderConfirmationPage, isCartLoginPage } = useCheckoutProvider();

    usePostHog();

    const backLink = !isOrderConfirmationPage ? '/cart' : '/';

    return (
        <>
            <header className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.content}>
                        <div className={classes.action}>
                            <Link className={classes.linkSecondary} to={backLink}>
                                <Icon src={ArrowLeft} classes={{ root: classes.linkSecondaryIcon }} />
                                <FormattedMessage id="checkoutPageHeader.goBack" defaultMessage="Go Back" />
                            </Link>
                        </div>
                        <div className={classes.logoContainer}>
                            <Link to={resourceUrl('/')}>
                                <Logo />
                            </Link>
                        </div>
                    </div>
                    {!isOrderConfirmationPage && !isCartLoginPage && (
                        <Countdown
                            classes={{ root: classes.countdownRoot, shimmer: classes.countdownShimmer }}
                            isDuplicate={true}
                        />
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
