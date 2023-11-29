import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useCallback, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { GET_CUSTOMER_ORDERS } from '../orderHistoryPage.gql';
import {
    REORDER_ITEMS,
    GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    GET_ORDER_PDF
} from '../orderRow.gql';

import { ToastType, useToasts } from '@app/hooks/useToasts';

const PAGE_SIZE = 10;
export const useOrderDetails = props => {
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const { orderId } = props;

    const [searchText, setSearchText] = useState(orderId);

    const { data: orderData, loading: orderLoading, called } = useQuery(GET_CUSTOMER_ORDERS, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: {
                number: {
                    match: searchText
                }
            },
            pageSize: PAGE_SIZE
        }
    });

    const order = useMemo(() => {
        return orderData ? orderData.customer.orders.items[0] : null;
    }, [orderData]);

    const [getOrderPdfUrl] = useLazyQuery(GET_ORDER_PDF, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !orderId,
        variables: { order_id: orderId },
        onCompleted: data => {
            const orderPdfUrl = data ? data.getOrderPdfUrl.pdf_order_url : null;

            if (orderPdfUrl) {
                window.open(window.location.origin + orderPdfUrl, '_blank');
            } else {
                addToast({
                    type: 'error',
                    message: formatMessage(
                        {
                            id: 'invoices.notAvailable',
                            defaultMessage: `Invoice for {orderNumber} is not available, please contact customer support.`
                        },
                        { orderNumber: orderId }
                    )
                });
            }
        }
    });

    const handleOrderPrintButtonClick = () => {
        getOrderPdfUrl();
    };

    const items = useMemo(() => {
        return order ? order.items : [];
    }, [order]);

    const handleSubmit = useCallback(search => {
        setSearchText(search);
    }, []);
    const urlKeys = useMemo(() => {
        return items.length ? items.map(item => item.product_url_key).sort() : [];
    }, [items]);

    const { data, loading } = useQuery(GET_PRODUCT_THUMBNAILS_BY_URL_KEY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKeys
        }
    });

    const { data: configurableThumbnailSourceData } = useQuery(GET_CONFIGURABLE_THUMBNAIL_SOURCE, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData) {
            return configurableThumbnailSourceData.storeConfig.configurable_thumbnail_source;
        }
    }, [configurableThumbnailSourceData]);

    const imagesData = useMemo(() => {
        if (data) {
            // Images data is taken from simple product or from configured variant and assigned to item sku
            const mappedImagesData = {};
            items.forEach(item => {
                const product = data.products.items.find(element => item.product_url_key === element.url_key);
                if (configurableThumbnailSource === 'itself' && product.variants && product.variants.length > 0) {
                    const foundVariant = product.variants.find(variant => {
                        return variant.product.sku === item.product_sku;
                    });
                    mappedImagesData[item.product_sku] = foundVariant.product;
                } else {
                    mappedImagesData[item.product_sku] = product;
                }
            });

            return mappedImagesData;
        } else {
            return {};
        }
    }, [data, items, configurableThumbnailSource]);

    const itemsInOrder = items;
    const outOfStockItems = items.filter(item => item.stock_status === 'OUT_OF_STOCK');
    const allItemsOutOfStock = outOfStockItems.length === itemsInOrder.length;

    const [reorderItems] = useMutation(REORDER_ITEMS);

    const { push } = useHistory();
    const handleReorderItems = useCallback(async () => {
        try {
            await reorderItems({
                variables: {
                    orderNumber: orderId
                }
            });

            !allItemsOutOfStock
                ? addToast({
                      type: 'success',
                      message: formatMessage(
                          {
                              id: 'myAccount.reorderSuccess',
                              defaultMessage: `All available items from previous order NR: {orderNumber} were added to cart`
                          },
                          { orderNumber: orderId }
                      )
                  })
                : addToast({
                      type: 'error',
                      message: formatMessage(
                          {
                              id: 'myAccount.reorderAllOutOfStock',
                              defaultMessage: `All items from previous order NR: {orderNumber} are OUT OF STOCK`
                          },
                          { orderNumber: orderId }
                      )
                  });

            !allItemsOutOfStock &&
                outOfStockItems.map(i =>
                    addToast({
                        type: 'error',
                        message: formatMessage(
                            {
                                id: 'myAccount.reorderOutofStockItem',
                                defaultMessage: `{itemName} is OUT OF STOCK and was not added to cart`
                            },
                            { itemName: i.name }
                        )
                    })
                );

            !allItemsOutOfStock && push('/cart');
        } catch (e) {
            addToast({
                type: ToastType.ERROR,
                message: e.message,
                timeout: 10000
            });
        }
    }, [reorderItems, orderId, allItemsOutOfStock, addToast, formatMessage, outOfStockItems, push]);

    return {
        loading,
        imagesData,
        order,
        orderLoading,
        handleSubmit,
        items,
        called,
        handleOrderPrintButtonClick,
        handleReorderItems
    };
};
