import { useMutation } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useProductAddedModalContext } from '@app/components/ProductAddedModal/useProductAddedModalContext';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import operations from './addToCart.gql';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.type_id - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = ['virtual', 'bundle', 'grouped', 'downloadable'];

export const useAddToCartButton = props => {
    const { item } = props;

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { trackAddToCart, getProductCategories } = useTracking();

    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const inStockStatuses = ['IN_STOCK', 'PREORDER'];
    const isPreorder = item.stock_status === 'PREORDER';
    const isInStock = inStockStatuses.includes(item.stock_status);

    const productType = item.type_id;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();
    const { setShowModal, setModalData } = useProductAddedModalContext();

    const [addToCart] = useMutation(operations.ADD_ITEM, {
        onError: () => {
            setIsLoading(false);

            addToast({
                type: ToastType.ERROR,
                message: formatMessage(
                    {
                        id: 'addToCart.unknownMsg',
                        defaultMessage: `Failed to add {name} to your shopping cart. Unknown error`
                    },
                    {
                        name: item.name
                    }
                ),
                timeout: false
            });
        },
        onCompleted: data => {
            const response = data && data.addProductsToCart;
            const hasErrors = response.user_errors && response.user_errors.length > 0;

            if (hasErrors) {
                response.user_errors.map(error => {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                });
            } else {
                trackAddToCart({
                    currencyCode: item.price_range.maximum_price.final_price.currency,
                    price: item.price_range.maximum_price.final_price.value,
                    products: [
                        {
                            ...item,
                            quantity,
                            price: item.price_range.maximum_price.final_price.value,
                            currency: item.price_range.maximum_price.final_price.currency,
                            category: getProductCategories(item.categories)
                        }
                    ]
                });

                if (quantity > 1) {
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage(
                            {
                                id: 'addToCart.successMsgQty',
                                defaultMessage: `You added {quantity} items of {name} to your shopping cart.`
                            },
                            {
                                name: item.name,
                                quantity
                            }
                        )
                    });
                } else {
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage(
                            {
                                id: 'addToCart.successMsg',
                                defaultMessage: `You added {name} to your shopping cart.`
                            },
                            {
                                name: item.name
                            }
                        )
                    });
                }

                setModalData({
                    name: item.name,
                    image: item.small_image.url,
                    qty: quantity,
                    stock_status: item.stock_status,
                    preorder_note: item.preorder_note
                });
                setShowModal(true);
            }

            setIsLoading(false);
        }
    });

    const handleQuantityChange = useCallback(
        value => {
            setQuantity(value);
        },
        [setQuantity]
    );

    // Fire the quantity change after some wait time. We calculate the current delay
    // As enough time for a user to spam inc/dec quantity but not enough time
    // For a user to click inc/dec on Product A and then click Product B.
    const handleQuantityChangeDebounced = useMemo(
        () =>
            debounce(value => {
                handleQuantityChange(value);
                setIsLoading(false);
            }, 350),
        [handleQuantityChange]
    );

    const changeQtyWithLoading = useCallback(
        value => {
            setIsLoading(true);
            handleQuantityChangeDebounced(value);
        },
        [handleQuantityChangeDebounced]
    );

    const handleAddToCart = useCallback(
        async ({ quantity: qty }) => {
            if (qty && quantity !== qty) {
                setQuantity(qty);
            }
            const productQty = qty ? qty : quantity;

            try {
                if (productType === 'simple') {
                    setIsLoading(true);
                    await addToCart({
                        variables: {
                            cartId,
                            cartItem: {
                                quantity: productQty,
                                entered_options: [
                                    {
                                        uid: item.uid,
                                        value: item.name
                                    }
                                ],
                                sku: item.sku
                            }
                        }
                    });
                } else if (productType === 'configurable') {
                    history.push(`${item.url_key}.html`);
                } else {
                    console.warn('Unsupported product type unable to handle.');
                }
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            }
        },
        [productType, addToCart, cartId, quantity, item.uid, item.name, item.sku, item.url_key, addToast, history]
    );

    return {
        handleAddToCart,
        handleQuantityChange,
        changeQtyWithLoading,
        isDisabled,
        isInStock,
        isPreorder
    };
};
