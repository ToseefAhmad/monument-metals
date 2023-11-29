import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useCallback, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';

import {
    REORDER_ITEMS,
    GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    GET_ORDER_PDF
} from './orderRow.gql';

/**
 * @function
 *
 * @param {Object} props
 * @param {Array<Object>} props.items Collection of items in Order
 * @param {OrderRowOperations} props.operations GraphQL queries for the Order Row Component
 *
 * @returns {OrderRowTalonProps}
 */
export const useOrderRow = ({ items, orderNumber }) => {
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const [reorderItems] = useMutation(REORDER_ITEMS);

    const urlKeys = useMemo(() => {
        return items.map(item => item.product_url_key).sort();
    }, [items]);

    const { data, loading } = useQuery(GET_PRODUCT_THUMBNAILS_BY_URL_KEY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKeys
        }
    });

    const [getOrderPdfUrl] = useLazyQuery(GET_ORDER_PDF, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !orderNumber,
        variables: { order_id: orderNumber },
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
                        { orderNumber: orderNumber }
                    )
                });
            }
        }
    });

    const handleOrderPrintButtonClick = () => {
        getOrderPdfUrl();
    };

    const itemsInOrder = data && data.products.items;
    const outOfStockItems = data && itemsInOrder.filter(item => item.stock_status === 'OUT_OF_STOCK');
    const allItemsOutOfStock = data && outOfStockItems.length === itemsInOrder.length;

    const { push } = useHistory();
    const handleReorderItems = useCallback(async () => {
        try {
            await reorderItems({
                variables: {
                    orderNumber
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
                          { orderNumber: orderNumber }
                      )
                  })
                : addToast({
                      type: 'error',
                      message: formatMessage(
                          {
                              id: 'myAccount.reorderAllOutOfStock',
                              defaultMessage: `All items from previous order NR: {orderNumber} are OUT OF STOCK`
                          },
                          { orderNumber: orderNumber }
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
    }, [addToast, formatMessage, orderNumber, allItemsOutOfStock, push, outOfStockItems, reorderItems]);

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

    const [isOpen, setIsOpen] = useState(false);

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    return {
        loading,
        imagesData,
        isOpen,
        handleContentToggle,
        handleReorderItems,
        handleOrderPrintButtonClick
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Order Row Component
 *
 * @typedef {Object} OrderRowOperations
 *
 * @property {GraphQLAST} getProductThumbnailsQuery The query used to get product thumbnails of items in the Order.
 *
 * @see [`orderRow.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/OrderHistoryPage/orderRow.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} OrderRowTalonProps
 *
 * @property {Object} imagesData Images data with thumbnail URLs to render.
 * @property {Boolean} isOpen Boolean which represents if a row is open or not
 * @property {Function} handleContentToggle Callback to toggle isOpen value
 */
