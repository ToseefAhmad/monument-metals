import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const { push } = useHistory();

    const handleSignOut = useCallback(() => {
        onSignOut();
        push('/');
    }, [onSignOut, push]);

    const MENU_ITEMS = [
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
            id: 'accountPageWrapper.communications',
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

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};
