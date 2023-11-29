import { useState, useEffect, useCallback } from 'react';

import { useOnScroll } from '@app/hooks/useOnScroll';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useScrollLock } from '@magento/peregrine/lib/hooks/useScrollLock.js';

const DEFAULT_TOPBAR_OFFSET = 50;

export const useHeader = ({ topBarRef }) => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();
    const { isDesktopScreen } = useScreenSize();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useScrollLock(isSearchOpen);

    const handleSearchTriggerClick = useCallback(() => {
        // Toggle the Search input form.
        setIsSearchOpen(isOpen => !isOpen);
    }, [setIsSearchOpen]);

    const closeSearchBar = () => {
        setIsSearchOpen(false);
    };

    // Make search field always be visible on desktop
    useEffect(() => {
        isDesktopScreen ? setIsSearchVisible(true) : setIsSearchVisible(false);
    }, [isDesktopScreen, setIsSearchOpen]);

    // Set up scroll state for sticky header
    const [isScrolled, setIsScrolled] = useState(false);
    const topBarOffset = topBarRef.current ? topBarRef.current.offsetHeight : DEFAULT_TOPBAR_OFFSET;

    useOnScroll(globalThis.document, () => {
        setIsScrolled(globalThis.scrollY > topBarOffset);
    });

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        isSearchVisible,
        isScrolled,
        searchRef,
        searchTriggerRef,
        closeSearchBar
    };
};
