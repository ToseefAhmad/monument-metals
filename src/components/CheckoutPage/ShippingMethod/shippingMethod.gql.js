import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { ShippingInformationFragment } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/shippingInformationFragments.gql';

import { SelectedShippingMethodCheckoutFragment } from './shippingMethodFragments.gql';

const AvailableShippingMethodsByCountryCodeFragment = gql`
    fragment AvailableShippingMethodsByCountryCodeFragment on Cart {
        available_shipping_methods(country_code: $countryCode) {
            id
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
                currency
                value
            }
        }
    }
`;

export const getSelectedAndAvailableShippingMethodsQuery = gql`
    query getSelectedAndAvailableShippingMethods($cartId: String!, $countryCode: String!) {
        cart(cart_id: $cartId) {
            id
            ...SelectedShippingMethodCheckoutFragment
            ...AvailableShippingMethodsByCountryCodeFragment
            # We include the following fragments to avoid extra requeries
            # after this mutation completes. This all comes down to not
            # having ids for shipping address objects. With ids we could
            # merge results.
            ...ShippingInformationFragment
        }
    }
    ${SelectedShippingMethodCheckoutFragment}
    ${ShippingInformationFragment}
    ${AvailableShippingMethodsByCountryCodeFragment}
`;

export const setShippingMethodMutation = gql`
    mutation SetShippingMethod($cartId: String!, $shippingMethod: ShippingMethodInput!, $countryCode: String!) {
        setShippingMethodsOnCart(input: { cart_id: $cartId, shipping_methods: [$shippingMethod] })
            @connection(key: "setShippingMethodsOnCart") {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...SelectedShippingMethodCheckoutFragment
                ...PriceSummaryFragment
                # We include the following fragments to avoid extra requeries
                # after this mutation completes. This all comes down to not
                # having ids for shipping address objects. With ids we could
                # merge results.
                ...ShippingInformationFragment
                ...AvailableShippingMethodsByCountryCodeFragment
            }
        }
    }
    ${SelectedShippingMethodCheckoutFragment}
    ${PriceSummaryFragment}
    ${ShippingInformationFragment}
    ${AvailableShippingMethodsByCountryCodeFragment}
`;
