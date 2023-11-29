import { useMutation } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useOlarkHelper } from '@app/components/Olark/useOlarkHelper';
import MetalInformationOperations from '@app/components/ProductAlerts/Account/gql/metalInformation.gql';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import marketOperations from './MetalPrice/priceOperations.gql';
import productOperations from './ProductPrice/priceOperations.gql';
import { PRICE_ALERTS } from './shared';

export const usePrice = ({ sku, type }) => {
    const operations = type === PRICE_ALERTS ? productOperations : marketOperations;

    const {
        mutations: { priceNotify }
    } = operations;
    const {
        queries: { getAlertsQuery }
    } = MetalInformationOperations;

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();
    const [, { addToast }] = useToasts();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);
    const handleClose = () => {
        popupRef.current.close();
        setIsSuccess(false);
        setIsOpen(false);
    };
    const handleOpen = () => {
        setIsOpen(true);
    };
    useOlarkHelper(isOpen);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [setNotify, { loading: isLoading }] = useMutation(priceNotify);

    const handleSubmit = useCallback(
        async field => {
            try {
                if (type === PRICE_ALERTS) {
                    await setNotify({
                        variables: {
                            sku,
                            type: parseInt(field.type),
                            price: parseFloat(field.price)
                        }
                    });
                    setIsSuccess(true);
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage({
                            id: 'productAlerts.priceSuccess',
                            defaultMessage: 'You will receive an e-mail once configured price is reached'
                        })
                    });
                } else {
                    await setNotify({
                        variables: {
                            metalType: parseInt(field.metal_type),
                            type: parseInt(field.type),
                            price: parseFloat(field.price)
                        },
                        refetchQueries: [
                            {
                                query: getAlertsQuery,
                                variables: {
                                    pageSize: 10
                                }
                            }
                        ]
                    });
                    setIsSuccess(true);
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage({
                            id: 'productAlerts.priceSuccess',
                            defaultMessage: 'You will receive an e-mail once configured price is reached'
                        })
                    });
                }
            } catch (error) {
                setIsSuccess(false);
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            }
        },
        [type, setNotify, sku, addToast, formatMessage, getAlertsQuery]
    );

    return {
        handleSubmit,
        isLoading,
        isSignedIn,
        setFormApi,
        formApiRef,
        popupRef,
        handleClose,
        isSuccess,
        handleOpen,
        isOpen
    };
};
