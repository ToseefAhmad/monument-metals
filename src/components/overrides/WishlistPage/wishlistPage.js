import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import CreateWishlist from '@magento/venia-ui/lib/components/WishlistPage/createWishlist';

import { useWishlistPage } from './useWishlistPage';
import Wishlist from './wishlist';
import classes from './wishlistPage.module.css';

const WishlistPage = () => {
    const talonProps = useWishlistPage();
    const { errors, loading, shouldRenderVisibilityToggle, wishlists } = talonProps;
    const { formatMessage } = useIntl();
    const error = errors.get('getCustomerWishlistQuery');

    const WISHLIST_DISABLED_MESSAGE = formatMessage({
        id: 'wishlistPage.wishlistDisabledMessage',
        defaultMessage: 'The wishlist is not currently available.'
    });
    const wishlistElements = useMemo(() => {
        if (wishlists.length === 0) {
            return <Wishlist />;
        }

        return wishlists.map((wishlist, index) => (
            <Wishlist
                key={wishlist.id}
                isCollapsed={index !== 0}
                data={wishlist}
                loading={loading}
                shouldRenderVisibilityToggle={shouldRenderVisibilityToggle}
            />
        ));
    }, [loading, shouldRenderVisibilityToggle, wishlists]);

    let content;
    if (error) {
        const derivedErrorMessage = deriveErrorMessage([error]);
        const errorElement =
            derivedErrorMessage === WISHLIST_DISABLED_MESSAGE ? (
                <p>
                    <FormattedMessage
                        id={'wishlistPage.disabledMessage'}
                        defaultMessage={'Sorry, this feature has been disabled.'}
                    />
                </p>
            ) : (
                <p className={classes.fetchError}>
                    <FormattedMessage
                        id={'wishlistPage.fetchErrorMessage'}
                        defaultMessage={'Something went wrong. Please refresh and try again.'}
                    />
                </p>
            );

        content = <div className={classes.errorContainer}>{errorElement}</div>;
    } else {
        content = (
            <Fragment>
                {wishlistElements}
                <CreateWishlist />
            </Fragment>
        );
    }

    return <AccountPageWrapper pageTitle="WishList">{content}</AccountPageWrapper>;
};

export default WishlistPage;
