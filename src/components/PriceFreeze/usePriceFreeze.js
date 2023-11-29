import { useLazyQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { priceFreezeInitMutation, getCheckoutDetailsQuery } from './priceFreeze.gql';

export const usePriceFreeze = () => {
    const [{ cartId }] = useCartContext();
    const [priceFreezeData, setPriceFreezeData] = useState(null);

    const [dateNow, setDateNow] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);

    const [initPriceFreeze] = useMutation(priceFreezeInitMutation, {
        fetchPolicy: 'no-cache',
        onCompleted: data => {
            setPriceFreezeData(data.PriceFreezeInitiate);
            getCheckoutData({
                variables: {
                    cartId
                }
            });
        }
    });

    const [
        getCheckoutData,
        {
            data: checkoutData,
            loading: checkoutDataLoading,
            called: checkoutDataCalled,
            networkStatus: checkoutQueryNetworkStatus
        }
    ] = useLazyQuery(getCheckoutDetailsQuery, {
        skip: !cartId,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        variables: {
            cartId
        }
    });

    const isLoading = useMemo(() => {
        return checkoutQueryNetworkStatus ? checkoutQueryNetworkStatus < 7 : true;
    }, [checkoutQueryNetworkStatus]);

    const runPriceFreeze = useCallback(() => {
        initPriceFreeze({
            variables: {
                cartId
            }
        });
    }, [initPriceFreeze, cartId]);

    useEffect(() => {
        if (cartId) {
            runPriceFreeze();
        }
    }, [runPriceFreeze, cartId]);

    useEffect(() => {
        if (priceFreezeData && !isLoading) {
            setDateNow(moment(priceFreezeData.freeze_start, moment.ISO_8601).toDate());
            const endDate = moment(priceFreezeData.freeze_end, moment.ISO_8601).toDate();
            setDateEnd(endDate);
        }
    }, [isLoading, priceFreezeData]);

    return {
        runPriceFreeze,
        priceFreezeData,
        checkoutData,
        checkoutDataLoading: isLoading || checkoutDataLoading || !checkoutDataCalled,
        priceFreezeDateNow: dateNow,
        priceFreezeDateEnd: dateEnd
    };
};
