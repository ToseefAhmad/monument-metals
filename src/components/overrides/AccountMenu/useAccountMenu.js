import { useMutation } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Header/accountMenu.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * The useAccountMenu talon complements the AccountMenu component.
 *
 * @param {Object} props
 * @param {DocumentNode} props.operations.signOutMutation - Mutation to be called for signout.
 * @param {Boolean} props.accountMenuIsOpen - Boolean to notify if the account menu dropdown is open.
 * @param {Function} props.setAccountMenuIsOpen - Function to set the value of accountMenuIsOpen
 *
 * @returns {Object}    talonProps
 * @returns {String}    talonProps.view - Current view.
 * @returns {String}  talonProps.username - Username of the current user trying to login / logged in.
 * @returns {Boolean}   talonProps.isUserSignedIn - Boolean to notify if the user is signed in.
 * @returns {Function}  talonProps.handleSignOut - Function to handle the signout workflow.
 * @returns {Function}  talonProps.handleForgotPassword - Function to handle forgot password workflow.
 * @returns {Function}  talonProps.handleCreateAccount - Function to handle create account workflow.
 * @returns {Function}  talonProps.setUsername - Function to set the username.
 */

export const useAccountMenu = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { signOutMutation } = operations;

    const [username, setUsername] = useState('');

    const history = useHistory();
    const location = useLocation();
    const [revokeToken] = useMutation(signOutMutation);
    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();
    const [{ isAccountMenuOpen, accountMenuView }, { setAccountMenuOpen, setAccountMenuView }] = useAppContext();

    const handleSignOut = useCallback(async () => {
        setAccountMenuView('SIGNIN');
        setAccountMenuOpen(false);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });

        history.replace({ pathname: '/' });

        // Refresh the page as a way to say "re-initialize". An alternative
        // Would be to call apolloClient.resetStore() but that would require
        // A large refactor.
        history.go(0);
    }, [history, revokeToken, setAccountMenuOpen, setAccountMenuView, signOut]);

    const handleForgotPassword = useCallback(() => {
        setAccountMenuView('FORGOT_PASSWORD');
    }, [setAccountMenuView]);

    const handleCancel = useCallback(() => {
        setAccountMenuView('SIGNIN');
    }, [setAccountMenuView]);

    const handleClose = useCallback(() => {
        setAccountMenuOpen(false);
    }, [setAccountMenuOpen]);

    const handleCreateAccount = useCallback(() => {
        setAccountMenuView('CREATE_ACCOUNT');
    }, [setAccountMenuView]);

    const handleAccountCreation = useCallback(() => {
        setAccountMenuView('ACCOUNT');
    }, [setAccountMenuView]);

    // Close the Account Menu on page change.
    // This includes even when the page "changes" to the current page.
    // This can happen when clicking on a link to a page you're already on, for example.
    useEffect(() => {
        setAccountMenuOpen(false);
    }, [location, setAccountMenuOpen]);

    // Update view based on user status everytime isAccountMenuOpen has changed to closed.
    useEffect(() => {
        if (!isAccountMenuOpen) {
            if (isUserSignedIn) {
                setAccountMenuView('ACCOUNT');
            } else {
                setAccountMenuView('SIGNIN');
            }
        }
    }, [isAccountMenuOpen, isUserSignedIn, setAccountMenuView]);

    return {
        handleAccountCreation,
        handleCreateAccount,
        handleForgotPassword,
        handleCancel,
        handleClose,
        handleSignOut,
        updateUsername: setUsername,
        isAccountMenuOpen,
        username,
        accountMenuView
    };
};
