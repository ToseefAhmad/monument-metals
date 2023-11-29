import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useCartLoginPage = () => {
    const { setIsCartLoginPage } = useCheckoutProvider();
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();

    useEffect(() => {
        if (isSignedIn) {
            history.push('/cart');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    useEffect(() => {
        setIsCartLoginPage(true);
    }, [setIsCartLoginPage]);

    return {};
};
