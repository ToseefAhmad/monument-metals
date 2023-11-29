import { gql } from '@apollo/client';

import { CheckoutPageFragment } from '@app/components/overrides/CheckoutPage/checkoutPageFragments.gql';

export const getCheckoutDetailsQuery = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const priceFreezeInitMutation = gql`
    mutation PriceFreezeInitiate($cartId: String!) {
        PriceFreezeInitiate(input: { cartId: $cartId }) {
            freeze_start
            freeze_end
            metal_price {
                identifier
                ask
                change
            }
        }
    }
`;

export const priceFreezeResetMutation = gql`
    mutation PriceFreezeReset($cartId: String!) {
        PriceFreezeReset(input: { cartId: $cartId }) {
            success
        }
    }
`;
