import { useCallback } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useNavigationTrigger = () => {
    const [, { toggleDrawer, setAccountMenuView }] = useAppContext();

    const handleOpenNavigation = useCallback(() => {
        toggleDrawer('nav');
        setAccountMenuView('MENU');
    }, [setAccountMenuView, toggleDrawer]);

    return {
        handleOpenNavigation
    };
};
