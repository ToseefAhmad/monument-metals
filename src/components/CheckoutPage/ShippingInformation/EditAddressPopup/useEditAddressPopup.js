import { useMutation } from '@apollo/client';
import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useCheckoutProvider } from '../../context';
import {
    setCustomerAddressOnCartMutation,
    getShippingInformationQuery,
    getCustomerAddressesQuery
} from '../shippingInformation.gql';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { updateCustomerAddressMutation } from './editAddressPopup.gql';

export const useEditAddressPopup = ({ selectedAddressId, address }) => {
    const { formatMessage } = useIntl();
    const { setIsUpdating, isUpdating } = useCheckoutProvider();
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const initialValues = {
        ...address,
        country: address.country_code
    };

    const [setCustomerAddressOnCart, { loading: setAddressLoading }] = useMutation(setCustomerAddressOnCartMutation);

    const [updateCustomerAddress, { loading: updateAddressLoading }] = useMutation(updateCustomerAddressMutation, {
        refetchQueries: [
            { query: getShippingInformationQuery, variables: { cartId } },
            { query: getCustomerAddressesQuery }
        ]
    });

    const handleSubmit = useCallback(
        async formValues => {
            const {
                firstname,
                lastname,
                company,
                country,
                city,
                street,
                region,
                postcode,
                telephone,
                default_shipping
            } = formValues;

            // Specify region_id in case of select or region in case of text input
            const customerRegion = {};
            if (region.region_id) {
                customerRegion['region_id'] = region.region_id;
            } else if (region.region) {
                customerRegion['region'] = region.region;
            }

            // Run set customer address on cart mutation
            const customerAddress = {
                postcode,
                city,
                firstname,
                lastname,
                company: company ? company : '',
                telephone,
                street,
                country_code: country,
                region: { ...customerRegion },
                default_shipping
            };

            try {
                setIsUpdating(true);
                await updateCustomerAddress({
                    variables: {
                        addressId: selectedAddressId,
                        address: customerAddress
                    }
                });
                await setCustomerAddressOnCart({
                    variables: {
                        cartId,
                        addressId: selectedAddressId
                    }
                });
                handlePopupClose();
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'updateAddress.successMsg',
                        defaultMessage: 'Your address has been successfully updated.'
                    })
                });
            } catch (error) {
                console.error(error);
                addToast({
                    type: ToastType.ERROR,
                    message: formatMessage({
                        id: 'updateAddress.errorMsg',
                        defaultMessage: 'Something went wrong, please try again later.'
                    })
                });
            } finally {
                setIsUpdating(false);
            }
        },
        [
            addToast,
            cartId,
            formatMessage,
            selectedAddressId,
            setCustomerAddressOnCart,
            setIsUpdating,
            updateCustomerAddress
        ]
    );

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    return {
        initialValues,
        isLoading: setAddressLoading || updateAddressLoading || isUpdating,
        handleSubmit,
        isPopupOpen,
        handlePopupOpen,
        handlePopupClose
    };
};
