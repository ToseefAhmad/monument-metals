import { useMutation } from '@apollo/client';
import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { AddToCartMutation } from './item.gql';

export const useItem = ({ product, storeConfigData }) => {
    const {
        sku,
        name,
        url_key,
        small_image: { label },
        price_range: {
            maximum_price: {
                final_price: { currency, value }
            }
        },
        price_tiers,
        categories
    } = product;
    const {
        storeConfig: { product_url_suffix }
    } = storeConfigData;
    const [{ cartId }] = useCartContext();
    const [addedProductQuantity, setAddedProductQuantity] = useState(0);
    const [priceValue, setPriceValue] = useState(value);

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { trackAddToCart, getProductCategories } = useTracking();

    const handleAddToCartResponse = useCallback(
        data => {
            const response = data && data.addProductsToCart;
            const hasErrors = response.user_errors && response.user_errors.length > 0;

            // Toasts message output
            if (hasErrors) {
                response.user_errors.map(error => {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                });
            } else {
                if (addedProductQuantity > 1) {
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage(
                            {
                                id: 'addToCart.successMsgQty',
                                defaultMessage: `You added {quantity} items of {name} to your shopping cart.`
                            },
                            {
                                name: name,
                                quantity: addedProductQuantity
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
                                name: name
                            }
                        )
                    });
                }
            }

            // Google tag manager tracking
            trackAddToCart({
                currencyCode: currency,
                price: value,
                products: [
                    {
                        ...product,
                        quantity: addedProductQuantity,
                        price: value,
                        currency: currency,
                        category: getProductCategories(categories)
                    }
                ]
            });
        },
        [
            addToast,
            addedProductQuantity,
            categories,
            currency,
            formatMessage,
            getProductCategories,
            name,
            product,
            trackAddToCart,
            value
        ]
    );

    const [addProductToCart, { loading: isAddProductToCartLoading }] = useMutation(AddToCartMutation, {
        onCompleted: handleAddToCartResponse
    });

    const handleAddToCart = useCallback(
        async ({ quantity }) => {
            try {
                setAddedProductQuantity(quantity);
                await addProductToCart({
                    variables: {
                        cartId,
                        product: {
                            quantity,
                            sku
                        }
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },
        [addProductToCart, cartId, sku]
    );

    const handleQuantityChange = useCallback(
        quantity => {
            const matchedPrice = price_tiers
                .filter(priceTier => priceTier.quantity <= quantity)
                .sort((prev, next) => next.quantity - prev.quantity)[0];

            if (matchedPrice) {
                setPriceValue(matchedPrice.final_price.value);
            } else {
                setPriceValue(value);
            }
        },
        [price_tiers, value]
    );

    const altText = label || name || 'upsell-product';
    const productLink = `/${url_key}${product_url_suffix || ''}`;

    return {
        handleAddToCart,
        isAddProductToCartLoading,
        handleQuantityChange,
        productLink,
        priceValue,
        altText
    };
};
