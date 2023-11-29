import { gql } from '@apollo/client';

import { CheckoutPageFragment } from '@app/components/overrides/CheckoutPage/checkoutPageFragments.gql';

export const createAccountMutation = gql`
    mutation CreateAccount(
        $email: String!
        $firstname: String!
        $lastname: String!
        $password: String!
        $is_subscribed: Boolean!
    ) {
        createCustomer(
            input: {
                email: $email
                firstname: $firstname
                lastname: $lastname
                password: $password
                is_subscribed: $is_subscribed
            }
        ) {
            # The createCustomer mutation returns a non-nullable CustomerOutput type
            # which requires that at least one of the sub fields be returned.
            customer {
                id
            }
        }
    }
`;

export const getCustomerQuery = gql`
    query GetCustomerAfterCreate {
        customer {
            id
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const signInMutation = gql`
    mutation SignInAfterCreate($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const createCartMutation = gql`
    mutation CreateCartAfterAccountCreation {
        cartId: createEmptyCart
    }
`;

export const getCartDetailsQuery = gql`
    query GetCartDetailsAfterAccountCreation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                prices {
                    price {
                        value
                    }
                }
                product {
                    id
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        id
                        option_label
                        value_id
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
        }
    }
`;

export const mergeCartsMutation = gql`
    mutation MergeCartsAfterAccountCreation($sourceCartId: String!, $destinationCartId: String!, $mergeItems: Boolean) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId, merge_items: $mergeItems)
            @connection(key: "mergeCarts") {
            id
            items {
                id
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const getSelectedPaymentMethodQuery = gql`
    query getPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
            }
        }
    }
`;

export const setSelectedPaymentMethodMutation = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $paymentCode: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: $paymentCode } }) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;
