import { useMutation } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useOlarkHelper } from '@app/components/Olark/useOlarkHelper';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import stockOperationsGql from './stockOperations.gql';

export const useNotify = ({ sku }) => {
    const {
        mutations: { stockNotify, stockNotifyGuest }
    } = stockOperationsGql;

    const { formatMessage } = useIntl();
    const [{ isSignedIn, currentUser }] = useUserContext();
    const [, { addToast }] = useToasts();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const handleClose = () => {
        popupRef.current.close();
        setIsSuccess(false);
        setIsPopupOpen(false);
    };
    const handleOpen = () => {
        setIsPopupOpen(true);
    };

    useOlarkHelper(isPopupOpen);

    const userEmail = currentUser ? currentUser.email : null;

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [setStockNotify, { loading: isLoading }] = useMutation(stockNotify);
    const [setStockNotifyGuest, { loading: isLoadingGuest }] = useMutation(stockNotifyGuest);

    const handleSubmit = useCallback(
        async field => {
            try {
                const qty = parseInt(field.qty);
                if (isSignedIn) {
                    await setStockNotify({
                        variables: {
                            sku,
                            qty
                        }
                    });
                } else {
                    const email = field.email.trim();
                    await setStockNotifyGuest({
                        variables: {
                            email,
                            sku,
                            qty
                        }
                    });
                }
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
                setIsSuccess(false);
                return;
            }

            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'productAlerts.stockSuccess',
                    defaultMessage: 'You will receive an e-mail once the product is back in stock'
                })
            });
            setIsSuccess(true);
        },
        [setStockNotifyGuest, setStockNotify, addToast, formatMessage, isSignedIn, sku]
    );

    return {
        handleSubmit,
        isLoading,
        isLoadingGuest,
        isSignedIn,
        setFormApi,
        formApiRef,
        popupRef,
        handleClose,
        userEmail,
        isSuccess,
        handleOpen,
        isOpen: isPopupOpen
    };
};
