import { useQuery, useMutation } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const DEFAULT_PAGE_SIZE = 10;

export const useAlertList = props => {
    const {
        mutations: { deleteAlertMutation },
        queries: { getAlertsQuery },
        type
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const { data: alertData, loading: alertDataLoading, refetch } = useQuery(getAlertsQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'network-only',
        variables: {
            pageSize
        }
    });

    const isLoadingWithoutData = !alertData && alertDataLoading;
    const isBackgroundLoading = !!alertData && alertDataLoading;

    const loadMore = useMemo(() => {
        if (alertData) {
            const { pageInfo } = alertData.customer.mp_product_alert[type];
            const { hasNextPage } = pageInfo;

            if (hasNextPage) {
                return () => setPageSize(current => current + DEFAULT_PAGE_SIZE);
            }
        }

        return null;
    }, [alertData, type]);

    const initialValues = useMemo(() => {
        if (alertData) {
            return {
                alerts: alertData.customer.mp_product_alert[type]
            };
        }
    }, [alertData, type]);

    const [deleteAlert, { loading: isDeletingItem }] = useMutation(deleteAlertMutation, {
        fetchPolicy: 'no-cache',
        onCompleted: refetch
    });

    const handleDelete = useCallback(
        async id => {
            await deleteAlert({
                variables: {
                    id
                }
            });
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'alert.remove message',
                    defaultMessage: 'Alert Removed'
                }),
                timeout: 5000
            });
        },
        [addToast, deleteAlert, formatMessage]
    );

    return {
        initialValues,
        loadMore,
        isLoadingWithoutData,
        isBackgroundLoading,
        handleDelete,
        isDeletingItem
    };
};
