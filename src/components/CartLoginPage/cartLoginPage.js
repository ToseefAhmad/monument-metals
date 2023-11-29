import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import GuestCart from '@app/components/GuestCart';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import classes from './cartLoginPage.module.css';
import { useCartLoginPage } from './useCartLoginPage';

const CartLoginPage = () => {
    useCartLoginPage();
    const { formatMessage } = useIntl();

    return (
        <>
            <StoreTitle>
                {formatMessage({
                    id: 'cartLoginPage.cartLogin',
                    defaultMessage: 'Cart Login'
                })}
            </StoreTitle>
            <div id="cart-login-page" className={classes.root}>
                <h1 className={classes.heading}>
                    <FormattedMessage id={'cartLoginPage.checkout'} defaultMessage={'Checkout'} />
                </h1>
                <GuestCart />
            </div>
        </>
    );
};

export default CartLoginPage;
