import { shape, string } from 'prop-types';
import React, { useMemo, useEffect, useRef } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useIntl, FormattedMessage } from 'react-intl';

import Button from '../Button';
import Icon from '../Icon';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import { useOrderHistoryPage } from './useOrderHistoryPage';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const { errorMessage, loadMoreOrders, isBackgroundLoading, isLoadingWithoutData, orders, searchText } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'My Orders'
    });

    const classes = useStyle(defaultClasses, props.classes);

    // Use Ref so that page is not reloaded on Load More
    const orderDataRef = useRef(null);

    if (!orderDataRef.current) {
        orderDataRef.current = [];
    }

    if (orders && orders.length > 0 && orderDataRef.current && orderDataRef.current.length < orders.length) {
        orderDataRef.current = orders;
    }

    const orderRows = useMemo(() => {
        if (orderDataRef.current.length > 0) {
            return orderDataRef.current.map(order => {
                return <OrderRow key={order.id} order={order} />;
            });
        }

        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders, orderDataRef]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber'}
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <table className={classes.orderHistoryTable}>
                    <thead>
                        <tr className={classes.tableHead}>
                            <th>Order Id</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>{orderRows}</tbody>
                </table>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        classes.tableHead,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderRows,
        orders.length,
        searchText
    ]);

    const loadMoreButtonContent = isBackgroundLoading ? (
        <FormattedMessage id={'orderHistoryPage.loadMoreLoading'} defaultMessage={'Loading More Orders'} />
    ) : (
        <FormattedMessage id={'orderHistoryPage.loadMore'} defaultMessage={'Load More'} />
    );
    const loadMoreButton = loadMoreOrders ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            {loadMoreButtonContent}
        </Button>
    ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    return (
        <AccountPageWrapper pageTitle={PAGE_TITLE}>
            <OrderHistoryContextProvider>
                <div className={classes.root}>
                    {pageContents}
                    {loadMoreButton}
                </div>
            </OrderHistoryContextProvider>
        </AccountPageWrapper>
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
