import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useEffect, useCallback, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';

import {
    getPaymentMethodsQuery,
    setPaymentMethodMutation,
    getDefaultPaymentMethodDescriptionQuery
} from './paymentMethods.gql';

export const useCartPayment = ({ fetchCartDetails, setPaymentSelected, refreshPayment, setRefreshPayment }) => {
    const [{ cartId }] = useCartContext();

    const [activePaymentOption, setActivePaymentOption] = useState('');
    const [initialActivePayment, setIntialActivePayment] = useState(false);
    const [activeDescription, setActiveDescription] = useState('');
    const [descriptionTitle, setDescriptionTitle] = useState('');
    const [descriptionFee, setDescriptionFee] = useState('');
    const [dispatchTitle, setDispatchTitle] = useState('');
    const [descriptionList, setDescriptionList] = useState([]);
    const [descriptionSize, setDescriptionSize] = useState('');

    const { data, loading, refetch, called } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        fetchPolicy: 'no-cache',
        variables: { cartId },
        onCompleted: data => {
            const code = data.cart.selected_payment_method.code || false;
            const methods = data.cart.available_payment_methods || [];

            if (!code) {
                setPaymentSelected(false);
                return;
            }

            const activeMethod = methods.find(paymentMethod => paymentMethod.code === code);
            if (!activeMethod || !activeMethod.active) {
                setActivePaymentOption('');
                setPaymentSelected(false);
            } else {
                setPaymentSelected(true);
            }
        }
    });

    const initialValues = {
        paymentCode: data && data.cart.selected_payment_method.code
    };

    const { data: storeConfigData, loading: storeConfigLoading } = useQuery(getDefaultPaymentMethodDescriptionQuery);

    const defaultPaymentDescription = storeConfigData ? storeConfigData.storeConfig.default_payment_description : '';
    const defaultPaymentTitle = storeConfigData ? storeConfigData.storeConfig.default_payment_title : '';
    const defaultPaymentSize = storeConfigData ? storeConfigData.storeConfig.default_payment_size : null;

    const [updatePaymentMethodMutation] = useMutation(setPaymentMethodMutation, {
        fetchPolicy: 'no-cache',
        onError: () => {
            setActivePaymentOption('');
            setPaymentSelected(false);
        },
        onCompleted: () => {
            fetchCartDetails({ variables: { cartId } });
            setPaymentSelected(true);
        }
    });

    useEffect(() => {
        if (called && data && !initialActivePayment) {
            setIntialActivePayment(true);
            setActivePaymentOption(data.cart.selected_payment_method.code);
        }
    }, [called, data, initialActivePayment]);

    const availablePaymentMethods = useMemo(() => {
        return (data && data.cart.available_payment_methods) || [];
    }, [data]);

    useEffect(() => {
        if (refreshPayment) {
            if (data) {
                refetch();
            }
            setRefreshPayment(false);
        }
    }, [data, refetch, refreshPayment, setRefreshPayment]);

    const activePaymentMethodData = useMemo(() => {
        return availablePaymentMethods.find(paymentMethod => paymentMethod.code === activePaymentOption);
    }, [availablePaymentMethods, activePaymentOption]);

    useEffect(() => {
        if (activePaymentMethodData !== undefined) {
            setActiveDescription(activePaymentMethodData.description);
            setDescriptionTitle(activePaymentMethodData.description_title);
            setDescriptionFee(activePaymentMethodData.payment_fee);
            setDispatchTitle(activePaymentMethodData.dispatch_title);
            setDescriptionList(activePaymentMethodData.description_list);
            setDescriptionSize(activePaymentMethodData.description_size);
        } else {
            setActiveDescription(defaultPaymentDescription);
            setDescriptionTitle(defaultPaymentTitle);
            setDescriptionSize(defaultPaymentSize);
        }
    }, [
        defaultPaymentDescription,
        setActiveDescription,
        setDescriptionFee,
        setDescriptionTitle,
        activePaymentMethodData,
        setDescriptionList,
        setDispatchTitle,
        defaultPaymentTitle,
        defaultPaymentSize
    ]);

    const paymentMethodData = useMemo(
        () =>
            availablePaymentMethods
                .filter(({ code }) => {
                    return Object.keys(payments).includes(code);
                })
                .map(
                    ({
                        code,
                        active,
                        title,
                        description,
                        payment_fee,
                        description_title,
                        dispatch_title,
                        description_list,
                        description_size
                    }) => {
                        return {
                            label: title,
                            code: code,
                            content: description,
                            fee: payment_fee,
                            descriptionTitle: description_title,
                            active,
                            dispatchTitle: dispatch_title,
                            descriptionList: description_list,
                            descriptionSize: description_size
                        };
                    }
                ),
        [availablePaymentMethods]
    );

    const updatePaymentMethod = useCallback(
        async paymentCode => {
            await updatePaymentMethodMutation({
                variables: { cartId, paymentCode }
            });
        },
        [cartId, updatePaymentMethodMutation]
    );

    const debouncedUpdatePaymentMethod = useMemo(
        () =>
            debounce(paymentCode => {
                updatePaymentMethod(paymentCode);
            }, 1000),
        [updatePaymentMethod]
    );

    const handleOptionChange = useCallback(
        ({ paymentCode }) => {
            setPaymentSelected(false);
            setActivePaymentOption(paymentCode);
            debouncedUpdatePaymentMethod(paymentCode);
        },
        [debouncedUpdatePaymentMethod, setPaymentSelected]
    );

    const updatePaymentMethodDescription = useCallback(
        ({ content, fee, dispatchTitle, descriptionTitle, descriptionList, descriptionSize }) => {
            setActiveDescription(content);
            setDescriptionTitle(descriptionTitle);
            setDescriptionFee(fee);
            setDispatchTitle(dispatchTitle);
            setDescriptionList(descriptionList);
            setDescriptionSize(descriptionSize);
        },
        []
    );

    const onMouseOverHandler = useCallback(
        data => {
            const { disabledMethod, isMobileScreen } = data;
            if (disabledMethod && isMobileScreen) return null;

            updatePaymentMethodDescription(data);
        },
        [updatePaymentMethodDescription]
    );

    const onFocus = useCallback(
        data => {
            updatePaymentMethodDescription(data);
        },
        [updatePaymentMethodDescription]
    );

    const onMouseLeaveHandler = useCallback(() => {
        setActiveDescription(activePaymentMethodData ? activePaymentMethodData.description : defaultPaymentDescription);
        setDescriptionTitle(activePaymentMethodData ? activePaymentMethodData.description_title : defaultPaymentTitle);
        setDescriptionFee(activePaymentMethodData ? activePaymentMethodData.payment_fee : null);
        setDispatchTitle(activePaymentMethodData ? activePaymentMethodData.dispatch_title : '');
        setDescriptionList(activePaymentMethodData ? activePaymentMethodData.description_list : '');
        setDescriptionSize(activePaymentMethodData ? activePaymentMethodData.description_size : defaultPaymentSize);
    }, [
        activePaymentMethodData,
        defaultPaymentDescription,
        defaultPaymentSize,
        defaultPaymentTitle,
        setActiveDescription,
        setDescriptionFee,
        setDescriptionList,
        setDescriptionSize,
        setDescriptionTitle,
        setDispatchTitle
    ]);

    return {
        availablePaymentMethods,
        isLoading: loading || storeConfigLoading,
        defaultPaymentDescription,
        activePaymentOption,
        activeDescription,
        descriptionTitle,
        descriptionFee,
        defaultPaymentTitle,
        paymentMethodData,
        descriptionList,
        dispatchTitle,
        descriptionSize,
        defaultPaymentSize,
        handleOptionChange,
        initialValues,
        onMouseOverHandler,
        onFocus,
        onMouseLeaveHandler
    };
};
