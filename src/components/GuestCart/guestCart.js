import React from 'react';

import OrderSummary from '@app/components/CheckoutPage/OrderSummary';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';

import CreateAccount from './CreateAccount';
import ForgotPasswordPopup from './ForgotPasswordPopup';
import classes from './guestCart.module.css';
import SignIn from './SignIn';
import { useGuestCart } from './useGuestCart';

const GuestCart = () => {
    const {
        isUpdating,
        setIsUpdating,
        isCreateAccountPopupOpen,
        handleCreateAccountOpen,
        handleCreateAccountClose,
        isForgotPasswordPopupOpen,
        handleForgotPasswordOpen,
        handleForgotPasswordClose
    } = useGuestCart();

    return (
        <>
            <div className={classes.root}>
                <div className={classes.signIn}>
                    <SignIn onCreateAccount={handleCreateAccountOpen} onForgotPassword={handleForgotPasswordOpen} />
                    <div className="selling-proposition-block selling-proposition-block-mobile">
                        <CmsBlock identifiers="selling-proposition" classes={{ root: classes.blockRoot }} />
                    </div>
                </div>
                <div className={classes.orderSummary}>
                    <OrderSummary isCountdownVisible={false} isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
                </div>
            </div>
            <CreateAccount
                isPopupOpen={isCreateAccountPopupOpen}
                onPopupClose={handleCreateAccountClose}
                onSubmit={handleCreateAccountClose}
            />
            <ForgotPasswordPopup isPopupOpen={isForgotPasswordPopupOpen} onPopupClose={handleForgotPasswordClose} />
        </>
    );
};

export default GuestCart;
