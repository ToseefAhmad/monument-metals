import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { SIGN_OUT } from '@magento/peregrine/lib/talons/Header/accountMenu.gql';

export const useAccountPageWrapper = () => {
    const [, { signOut }] = useUserContext();
    const location = useLocation();
    const { revokeToken } = useMutation(SIGN_OUT);
    const history = useHistory();

    const handleSignOut = useCallback(async () => {
        await signOut({ revokeToken });

        history.replace({ pathname: '/' });

        history.go(0);
    }, [revokeToken, history, signOut]);

    return {
        handleSignOut,
        pathname: location.pathname
    };
};
