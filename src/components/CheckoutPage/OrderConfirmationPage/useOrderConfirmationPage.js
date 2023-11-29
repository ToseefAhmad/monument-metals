import { useEffect, useState } from 'react';

import useTracking from '@app/hooks/useTracking/useTracking';
import { getCartItemSimpleSku } from '@app/util/getCartItemSimpleSku';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const flatten = ({ cart }) => {
    const { applied_gift_cards, prices, shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = `${address.selected_shipping_method.carrier_title} - ${
        address.selected_shipping_method.method_title
    }`;

    return {
        city: address.city,
        country: address.country.label,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region.label,
        shippingMethod,
        street: address.street,
        totalItemQuantity: cart.total_quantity,
        telephone: cart.billing_address.telephone,
        selectedPaymentMethod: cart.selected_payment_method,
        priceTotals: {
            subtotal: prices.subtotal_excluding_tax,
            total: prices.grand_total,
            discounts: prices.discounts,
            giftCards: applied_gift_cards,
            taxes: prices.applied_taxes,
            shipping: shipping_addresses
        }
    };
};

export const useOrderConfirmationPage = props => {
    const { data, orderNumber } = props;
    const [{ isSignedIn }] = useUserContext();
    const [isTrackDone, setIsTrackDone] = useState(false);

    const { trackPurchase, getProductCategories } = useTracking();

    const flatData = flatten(data);

    useEffect(() => {
        if (data && data.cart && data.cart.items.length > 0 && flatData && !isTrackDone) {
            trackPurchase({
                orderId: orderNumber,
                revenue: flatData.priceTotals.total.value,
                currencyCode: flatData.priceTotals.total.currency,
                tax:
                    data.cart.prices.applied_taxes &&
                    data.cart.prices.applied_taxes.reduce((prev, curr) => prev + curr.amount.value, 0),
                shipping:
                    data.cart.shipping_addresses &&
                    data.cart.shipping_addresses[0] &&
                    data.cart.shipping_addresses[0].selected_shipping_method.amount &&
                    data.cart.shipping_addresses[0].selected_shipping_method.amount.value,
                coupon: data.cart.applied_coupons && data.cart.applied_coupons.map(coupon => coupon.code).join(','),
                products: data.cart.items.map(item => ({
                    name: item.product.name,
                    price: item.prices.row_total.value,
                    currency: item.prices.row_total.currency,
                    quantity: item.quantity,
                    sku: getCartItemSimpleSku(item),
                    category: getProductCategories(item.product.categories)
                }))
            });
            setIsTrackDone(true);
        }
    }, [data, flatData, getProductCategories, isTrackDone, orderNumber, trackPurchase]);

    return {
        flatData,
        isSignedIn
    };
};
