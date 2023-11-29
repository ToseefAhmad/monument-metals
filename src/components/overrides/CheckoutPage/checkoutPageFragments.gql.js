import { gql } from '@apollo/client';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                stock_status
            }
            quantity
            prices {
                price {
                    value
                }
            }
        }
        # If total quantity is falsy we render empty.
        total_quantity
    }
`;
