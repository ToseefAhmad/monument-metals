import { gql } from '@apollo/client';

import { ItemsReviewFragment } from '../ItemsReview/itemsReviewFragments.gql';

import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';
import { GrandTotalFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';

export const OrderConfirmationPageFragment = gql`
    fragment OrderConfirmationPageFragment on Cart {
        id
        email
        total_quantity
        shipping_addresses {
            firstname
            lastname
            street
            city
            region {
                label
            }
            postcode
            country {
                label
            }
            selected_shipping_method {
                carrier_title
                method_title
                amount {
                    currency
                    value
                }
            }
        }
        billing_address {
            telephone
        }
        selected_payment_method {
            title
        }
        prices {
            ...TaxSummaryFragment
            ...DiscountSummaryFragment
            ...GrandTotalFragment
            subtotal_excluding_tax {
                currency
                value
            }
        }
        applied_coupons {
            code
        }
        ...ItemsReviewFragment
        ...GiftCardSummaryFragment
    }
    ${ItemsReviewFragment}
    ${DiscountSummaryFragment}
    ${GrandTotalFragment}
    ${TaxSummaryFragment}
    ${GiftCardSummaryFragment}
`;
