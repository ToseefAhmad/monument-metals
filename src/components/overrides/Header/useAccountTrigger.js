import { useCallback, useEffect } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

/**
 * The useAccountTrigger talon complements the AccountTrigger component.
 *
 * @returns {Object}    talonProps
 * @returns {Boolean}   talonProps.accountMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Function}  talonProps.setAccountMenuIsOpen  - Set the value of accoutMenuIsOpen.
 * @returns {Ref}       talonProps.accountMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.accountMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 */
export const useAccountTrigger = () => {
    const { elementRef: accountMenuRef, expanded, setExpanded, triggerRef: accountMenuTriggerRef } = useDropdown();
    const [{ isAccountMenuOpen }, { setAccountMenuOpen }] = useAppContext();

    const handleTriggerClick = useCallback(() => {
        setAccountMenuOpen(isOpen => !isOpen);
    }, [setAccountMenuOpen]);

    useEffect(() => {
        setExpanded(isAccountMenuOpen);
    }, [isAccountMenuOpen, setExpanded]);

    // Close when clicked outside
    useEffect(() => {
        if (!expanded) {
            setAccountMenuOpen(false);
        }
    }, [expanded, setAccountMenuOpen]);

    return {
        accountMenuRef,
        accountMenuTriggerRef,
        handleTriggerClick
    };
};
