import { useCallback } from 'react';

import { TrackingActions } from '@app/hooks/useTracking/useTracking';

const useGtm = () => {
    const handleEvent = useCallback(action => {
        if (typeof dataLayer === 'undefined') {
            return;
        }

        switch (action.type) {
            case TrackingActions.trackAddToCart:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'add_to_cart',
                    ecommerce: {
                        currency: action.payload.currencyCode,
                        value: action.payload.price,
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category
                        }))
                    }
                });
                return;
            case TrackingActions.trackRemoveFromCart:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'remove_from_cart',
                    ecommerce: {
                        currency: action.payload.currencyCode,
                        value: action.payload.priceValue,
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category
                        }))
                    }
                });
                return;
            case TrackingActions.trackProductImpression:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'view_item_list',
                    ecommerce: {
                        item_list_name: action.payload.list,
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            currency: product.currency,
                            price: product.price,
                            item_category: product.category,
                            index: product.position
                        }))
                    }
                });
                return;
            case TrackingActions.trackProductDetails:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'view_item',
                    ecommerce: {
                        items: [
                            {
                                item_id: action.payload.product.sku,
                                item_name: action.payload.product.name,
                                price: action.payload.product.price,
                                currency: action.payload.product.currency,
                                item_category: action.payload.product.category
                            }
                        ]
                    }
                });
                return;
            case TrackingActions.trackProductClick:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'select_item',
                    ecommerce: {
                        item_list_name: action.payload.listName,
                        items: [
                            {
                                item_id: action.payload.product.sku,
                                item_name: action.payload.product.name,
                                price: action.payload.product.price,
                                currency: action.payload.product.currency,
                                item_category: action.payload.product.category
                            }
                        ]
                    }
                });
                return;
            case TrackingActions.trackOpenCheckout:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'begin_checkout',
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity
                        }))
                    }
                });
                return;
            case TrackingActions.trackPurchase:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'purchase',
                    currency: action.payload.currencyCode,
                    ecommerce: {
                        transaction_id: action.payload.orderId,
                        value: action.payload.revenue,
                        coupon: action.payload.coupon,
                        tax: action.payload.tax,
                        shipping: action.payload.shipping,
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category
                        }))
                    }
                });
                return;
            default:
        }
    }, []);

    return {
        handleEvent
    };
};

export default useGtm;
