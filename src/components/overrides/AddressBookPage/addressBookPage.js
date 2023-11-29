import { objectOf, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../Button';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import AddEditDialog from './addEditDialog';
import defaultClasses from './addressBookPage.module.css';
import AddressCard from './addressCard';
import { useAddressBookPage } from './useAddressBookPage';

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading
    } = talonProps;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const PAGE_TITLE = formatMessage({
        id: 'addressBookPage.addressBookText',
        defaultMessage: 'Address Book'
    });
    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return Array.from(customerAddresses)
            .sort(defaultToBeginning)
            .map(addressEntry => {
                const countryName = countryDisplayNameMap.get(addressEntry.country_code);

                const boundEdit = () => handleEditAddress(addressEntry);
                const boundDelete = () => handleDeleteAddress(addressEntry.id);
                const isConfirmingDelete = confirmDeleteAddressId === addressEntry.id;

                return (
                    <AddressCard
                        address={addressEntry}
                        countryName={countryName}
                        isConfirmingDelete={isConfirmingDelete}
                        isDeletingCustomerAddress={isDeletingCustomerAddress}
                        key={addressEntry.id}
                        onCancelDelete={handleCancelDeleteAddress}
                        onConfirmDelete={handleConfirmDeleteAddress}
                        onDelete={boundDelete}
                        onEdit={boundEdit}
                    />
                );
            });
    }, [
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress
    ]);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'paymentMethods.loadingText'} defaultMessage={'Loading Addresses'} />
            </LoadingIndicator>
        );
    }

    return (
        <AccountPageWrapper pageTitle={PAGE_TITLE}>
            <div className={classes.root}>
                <h3 className={classes.heading}>{PAGE_TITLE}</h3>
                <div className={classes.content}>
                    {addressBookElements}
                    <div className={classes.addButtonContainer}>
                        <Button
                            priority="normal"
                            className={classes.addButton}
                            key="addAddressButton"
                            onClick={handleAddAddress}
                        >
                            <span className={classes.addText}>
                                <FormattedMessage
                                    id={'addressBookPage.addAddressTexts'}
                                    defaultMessage={'Add Address'}
                                />
                            </span>
                        </Button>
                    </div>
                </div>
                <AddEditDialog
                    formErrors={formErrors}
                    formProps={formProps}
                    isBusy={isDialogBusy}
                    isEditMode={isDialogEditMode}
                    isOpen={isDialogOpen}
                    onCancel={handleCancelDialog}
                    onConfirm={handleConfirmDialog}
                />
            </div>
        </AccountPageWrapper>
    );
};

AddressBookPage.propTypes = {
    classes: objectOf(string)
};

export default AddressBookPage;
