import { gql } from '@apollo/client';
export const CONTACT_US = gql`
    mutation ContactUsFormSubmit($name: String!, $email: String!, $phone: String, $message: String!) {
        contactUsFormSubmit(input: { fullname: $name, email: $email, telephone: $phone, message: $message }) {
            success_message
        }
    }
`;
