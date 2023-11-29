import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { useToasts, ToastType } from '@app/hooks/useToasts';
import defaultOperations from '@magento/peregrine/lib/talons/SavedPaymentsPage/creditCard.gql';

export const useSavedMethod = ({ paymentHash }) => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const { deleteCreditCardPaymentMutation } = defaultOperations;

    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const [deletePayment, { error, loading }] = useMutation(deleteCreditCardPaymentMutation);

    const handleDeletePayment = useCallback(async () => {
        try {
            await deletePayment({ variables: { paymentHash } });
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'savedPaymentsPage.creditCard.deletingSuccess',
                    defaultMessage: 'Your saved payment method was successfully deleted.'
                })
            });
        } catch {
            setIsConfirmingDelete(false);
        }
    }, [addToast, deletePayment, formatMessage, paymentHash]);

    const toggleDeleteConfirmation = useCallback(() => {
        setIsConfirmingDelete(current => !current);
    }, []);

    return {
        handleDeletePayment,
        hasError: !!error,
        isConfirmingDelete,
        isDeletingPayment: loading,
        toggleDeleteConfirmation
    };
};
