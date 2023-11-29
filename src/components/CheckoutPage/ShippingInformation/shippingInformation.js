import { func, bool, shape, number, arrayOf } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@app/components/overrides/Button';

import AddressBook from './AddressBook';
import AddressForm from './AddressForm';
import classes from './shippingInformation.module.css';
import ShippingInformationShimmer from './shippingInformation.shimmer';
import { useShippingInformation } from './useShippingInformation';

const ShippingInformation = ({
    onSuccess,
    resetSuccess,
    shouldSubmit,
    resetShouldSubmit,
    onError,
    preloadedCustomerAddresses
}) => {
    const {
        isLoading,
        shippingData,
        hasSavedAddress,
        customerAddresses,
        isAddNewAddress,
        handleAddNewAddress,
        handleSavedAddress,
        submitSavedAddress
    } = useShippingInformation({
        onSuccess,
        resetSuccess
    });

    if (isLoading) {
        return <ShippingInformationShimmer preloadedCustomerAddresses={preloadedCustomerAddresses} />;
    }

    const addressBook = isAddNewAddress ? (
        <>
            <div className={classes.buttonContainer}>
                <Button onClick={handleSavedAddress} priority="high">
                    <FormattedMessage
                        id={'shippingInformation.useDifferentAddress'}
                        defaultMessage={'Use Different Address'}
                    />
                </Button>
            </div>
            <AddressForm
                onSuccess={onSuccess}
                resetSuccess={resetSuccess}
                shouldSubmit={shouldSubmit}
                resetShouldSubmit={resetShouldSubmit}
                shippingData={shippingData}
                onError={onError}
                showInitialData={!isAddNewAddress}
            />
        </>
    ) : (
        <AddressBook
            onSuccess={onSuccess}
            resetSuccess={resetSuccess}
            customerAddresses={customerAddresses}
            onAddNewAddress={handleAddNewAddress}
            submitSavedAddress={submitSavedAddress}
        />
    );

    const content = hasSavedAddress ? (
        addressBook
    ) : (
        <AddressForm
            onSuccess={onSuccess}
            resetSuccess={resetSuccess}
            shouldSubmit={shouldSubmit}
            resetShouldSubmit={resetShouldSubmit}
            shippingData={shippingData}
            onError={onError}
        />
    );

    return <div className={classes.root}>{content}</div>;
};

ShippingInformation.propTypes = {
    shouldSubmit: bool,
    onSuccess: func.isRequired,
    resetShouldSubmit: func.isRequired,
    onError: func.isRequired,
    resetSuccess: func.isRequired,
    preloadedCustomerAddresses: arrayOf(
        shape({
            id: number
        })
    )
};

export default ShippingInformation;
