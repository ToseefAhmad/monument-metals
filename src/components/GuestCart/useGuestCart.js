import { useState } from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import { useScrollLock } from '@magento/peregrine';

export const useGuestCart = () => {
    const { isMobileScreen } = useScreenSize();

    const [isUpdating, setIsUpdating] = useState(false);

    const [isCreateAccountPopupOpen, setIsCreateAccountPopupOpen] = useState(false);
    const [isForgotPasswordPopupOpen, setIsForgotPasswordPopupOpen] = useState(false);

    // Default scrolllock from the popup package doesn't work properly because of redirect after the create account
    useScrollLock(isMobileScreen && isCreateAccountPopupOpen);
    useScrollLock(isMobileScreen && isForgotPasswordPopupOpen);

    const handleCreateAccountOpen = () => {
        setIsCreateAccountPopupOpen(true);
    };

    const handleCreateAccountClose = () => {
        setIsCreateAccountPopupOpen(false);
    };

    const handleForgotPasswordOpen = () => {
        setIsForgotPasswordPopupOpen(true);
    };

    const handleForgotPasswordClose = () => {
        setIsForgotPasswordPopupOpen(false);
    };

    return {
        isUpdating,
        setIsUpdating,
        isCreateAccountPopupOpen,
        handleCreateAccountOpen,
        handleCreateAccountClose,
        isForgotPasswordPopupOpen,
        handleForgotPasswordOpen,
        handleForgotPasswordClose
    };
};
