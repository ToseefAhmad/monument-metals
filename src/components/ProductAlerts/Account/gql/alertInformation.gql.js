import { gql } from '@apollo/client';

export const DELETE_ALERT = gql`
    mutation MpProductAlertCustomerNotifyInStock($id: Int!) {
        MpProductAlertSubscriberDelete(input: { id: $id })
    }
`;
