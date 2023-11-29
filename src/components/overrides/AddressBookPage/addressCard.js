import { arrayOf, bool, func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import LinkButton from '../LinkButton';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './addressCard.module.css';

const AddressCard = props => {
    const {
        address,
        classes: propClasses,
        countryName,
        isConfirmingDelete,
        isDeletingCustomerAddress,
        onCancelDelete,
        onConfirmDelete,
        onEdit,
        onDelete
    } = props;

    const {
        city,
        country_code,
        default_billing,
        default_shipping,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        telephone,
        company
    } = address;

    const classes = useStyle(defaultClasses, propClasses);
    const confirmDeleteButtonClasses = {
        root_normalPriorityNegative: classes.confirmDeleteButton
    };
    const cancelDeleteButtonClasses = {
        root_lowPriority: classes.deleteButton
    };

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    const defaultShippingBadge = default_shipping ? (
        <span className={classes.defaultBadge}>
            <FormattedMessage id={'addressCard.defaultShippingBadgeText'} defaultMessage={'Default Shipping'} />
        </span>
    ) : null;

    const defaultBillingBadge = default_billing ? (
        <span className={classes.defaultBadge}>
            <FormattedMessage id={'addressCard.BillingBadgeText'} defaultMessage={'Default Billing'} />
        </span>
    ) : null;

    const nameString = [firstname, lastname].filter(name => !!name).join(' ');
    const additionalAddressString = `${city}, ${region} ${postcode}`;
    const deleteButtonElement = !default_shipping ? (
        <Button classes={cancelDeleteButtonClasses} priority="low" onClick={onDelete}>
            <span className={classes.actionLabel}>
                <FormattedMessage id="addressBookPage.deleteAddress" defaultMessage="Delete" />
            </span>
        </Button>
    ) : null;

    const maybeConfirmingDeleteOverlay = isConfirmingDelete ? (
        <div className={classes.confirmDeleteContainer}>
            <Button
                classes={confirmDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="normal"
                type="button"
                negative={true}
                onClick={onConfirmDelete}
            >
                <FormattedMessage id={'global.deleteButton'} defaultMessage={'Delete'} />
            </Button>
            <Button
                classes={cancelDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="low"
                type="button"
                onClick={onCancelDelete}
            >
                <FormattedMessage id={'global.cancelButton'} defaultMessage={'Cancel'} />
            </Button>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.contentContainer}>
                <div className={classes.defaultBadges}>
                    {defaultShippingBadge}
                    {defaultBillingBadge}
                </div>
                <span className={classes.name}>{nameString}</span>
                {streetRows}
                <span className={classes.name}>{company}</span>
                <span className={classes.additionalAddress}>{additionalAddressString}</span>
                <span className={classes.country}>{countryName || country_code}</span>
                <span className={classes.telephone}>{telephone}</span>
            </div>
            <div className={classes.actionContainer}>
                <LinkButton
                    classes={{ root: default_shipping ? classes.editButtonOnly : classes.editButtonInRow }}
                    onClick={onEdit}
                >
                    <span className={classes.actionLabel}>
                        <FormattedMessage id="addressBookPage.editAddress" defaultMessage="Edit" />
                    </span>
                </LinkButton>
                {deleteButtonElement}
                {maybeConfirmingDeleteOverlay}
            </div>
        </div>
    );
};

export default AddressCard;

AddressCard.propTypes = {
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        firstname: string,
        lastname: string,
        postcode: string,
        company: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string),
        telephone: string
    }).isRequired,
    classes: shape({
        actionContainer: string,
        actionLabel: string,
        additionalAddress: string,
        contentContainer: string,
        country: string,
        defaultBadge: string,
        defaultCard: string,
        deleteButton: string,
        editButton: string,
        flash: string,
        linkButton: string,
        name: string,
        root: string,
        root_updated: string,
        streetRow: string,
        telephone: string
    }),
    countryName: string,
    isConfirmingDelete: bool,
    isDeletingCustomerAddress: bool,
    onCancelDelete: func,
    onConfirmDelete: func,
    onDelete: func,
    onEdit: func
};
