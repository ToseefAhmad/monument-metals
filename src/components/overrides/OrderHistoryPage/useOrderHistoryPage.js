import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { GET_CUSTOMER_ORDERS } from './orderHistoryPage.gql';
const PAGE_SIZE = 10;

export const useOrderHistoryPage = (props = {}) => {
    const { orderId } = props;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [searchText, setSearchText] = useState(orderId);
    const { data: orderData, error: getOrderError, loading: orderLoading } = useQuery(GET_CUSTOMER_ORDERS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'standby',
        variables: {
            filter: {
                number: {
                    match: searchText
                }
            },
            pageSize: pageSize
        }
    });

    const orders = orderData ? orderData.customer.orders.items : [];
    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const pageInfo = useMemo(() => {
        if (orderData) {
            const { total_count } = orderData.customer.orders;

            return {
                current: pageSize < total_count ? pageSize : total_count,
                total: total_count
            };
        }

        return null;
    }, [orderData, pageSize]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([getOrderError]), [getOrderError]);

    const handleReset = useCallback(() => {
        setSearchText('');
    }, []);

    const handleSubmit = useCallback(search => {
        setSearchText(search);
    }, []);

    const loadMoreOrders = useMemo(() => {
        if (orderData) {
            const { page_info } = orderData.customer.orders;
            const { current_page, total_pages } = page_info;

            if (current_page < total_pages) {
                return () => setPageSize(current => current + PAGE_SIZE);
            }
        }

        return null;
    }, [orderData]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders,
        pageInfo,
        searchText,
        orderLoading
    };
};
