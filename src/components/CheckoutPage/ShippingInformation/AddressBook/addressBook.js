import { arrayOf, shape, number, func, string, bool } from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { ToastType, useToasts } from '@app/hooks/useToasts';

import classes from './addressBook.module.css';
import AddressCard from './addressCard';
import { useAddressBook } from './useAddressBook';

const AddressBook = ({ customerAddresses, onAddNewAddress, submitSavedAddress, onSuccess, resetSuccess }) => {
    const { errorMessage, handleAddAddress, handleSelectAddress, selectedAddress } = useAddressBook({
        customerAddresses,
        onAddNewAddress,
        submitSavedAddress,
        onSuccess,
        resetSuccess
    });

    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: ToastType.ERROR,
                message: errorMessage,
                timeout: false
            });
        }
    }, [addToast, errorMessage]);

    const addAddressButton = useMemo(
        () => (
            <Button onClick={handleAddAddress} priority="high">
                <span className={classes.addText}>
                    <FormattedMessage id={'addressBook.addNewAddresstext'} defaultMessage={'Add New Address'} />
                </span>
            </Button>
        ),
        [handleAddAddress]
    );

    const addressElements = useMemo(() => {
        let defaultIndex;
        const addresses = customerAddresses.map((address, index) => {
            const isSelected = selectedAddress === address.id;

            if (address.default_shipping) {
                defaultIndex = index;
            }

            return (
                <AddressCard
                    address={address}
                    selectedAddressId={selectedAddress}
                    isSelected={isSelected}
                    key={address.id}
                    onSelection={handleSelectAddress}
                />
            );
        });

        // Position the default address first in the elements list
        if (defaultIndex) {
            [addresses[0], addresses[defaultIndex]] = [addresses[defaultIndex], addresses[0]];
        }

        return addresses;
    }, [customerAddresses, handleSelectAddress, selectedAddress]);

    return (
        <div className={classes.root}>
            <div className={classes.content}>{addressElements}</div>
            <div className={classes.buttonContainer}>{addAddressButton}</div>
        </div>
    );
};

AddressBook.propTypes = {
    customerAddresses: arrayOf(
        shape({
            city: string,
            company: string,
            country_code: string,
            default_shipping: bool,
            firstname: string,
            id: number,
            lastname: string,
            postcode: string,
            region: shape({
                region: string,
                region_code: string,
                region_id: number
            }),
            street: arrayOf(string),
            telephone: string
        })
    ),
    onAddNewAddress: func.isRequired,
    submitSavedAddress: string,
    onSuccess: func.isRequired,
    resetSuccess: func.isRequired
};

export default AddressBook;
