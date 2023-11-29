import { gql } from '@apollo/client';

import { ShippingMethodsCheckoutFragment } from '../ShippingMethod/shippingMethodFragments.gql';

import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentInformation.gql';

import { CustomerAddressFragment } from './AddressBook/addressBookFragments.gql.js';
import { ShippingInformationFragment } from './shippingInformationFragments.gql';

export const getCustomerAddressesQuery = gql`
    query GetCustomerAddresses {
        customer {
            id
            addresses {
                id
                ...CustomerAddressFragment
            }
        }
    }
    ${CustomerAddressFragment}
`;

export const getShippingInformationQuery = gql`
    query GetShippingInformation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export const getDefaultShippingQuery = gql`
    query GetDefaultShipping {
        customer {
            id
            default_shipping
        }
    }
`;

export const setCustomerAddressOnCartMutation = gql`
    mutation SetCustomerAddressOnCart($cartId: String!, $addressId: Int!) {
        setShippingAddressesOnCart(
            input: { cart_id: $cartId, shipping_addresses: [{ customer_address_id: $addressId }] }
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...ShippingInformationFragment
                ...ShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${ShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;
