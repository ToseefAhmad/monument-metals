import { useEffect } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

export const usePostHog = () => {
    const [{ isSignedIn, currentUser }] = useUserContext();

    const userEmail = currentUser ? currentUser.email : null;

    useEffect(() => {
        if (isSignedIn && window.posthog && userEmail) {
            window.posthog.identify(userEmail, {
                email: userEmail
            });
        }
    }, [isSignedIn, currentUser, userEmail]);
};
