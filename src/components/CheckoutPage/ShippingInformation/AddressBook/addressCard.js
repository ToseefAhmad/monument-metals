import { shape, string, bool, func, arrayOf, number } from 'prop-types';
import React from 'react';

import EditAddressPopup from '../EditAddressPopup';

import { CheckMark as CheckMarkIcon } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';

import classes from './addressCard.module.css';
import { useAddressCard } from './useAddressCard';

const AddressCard = ({ address, selectedAddressId, isSelected, onSelection }) => {
    const { handleClick, handleKeyPress, countryName } = useAddressCard({
        address,
        onSelection,
        isSelected
    });
    const {
        city,
        country_code,
        firstname,
        lastname,
        company,
        postcode,
        region: { region },
        street,
        telephone
    } = address;

    const selectedIcon = (
        <div className={classes.selectedIcon}>
            <Icon src={CheckMarkIcon} />
        </div>
    );

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region}, ${postcode}`;
    const country = countryName ? countryName : country_code;

    const addressContent = (
        <>
            {nameString}
            <span>{company}</span>
            {streetRows}
            <span>{additionalAddressString}</span>
            {country}
            <span>{telephone}</span>
        </>
    );

    const content = isSelected ? (
        <div className={classes.root_selected}>
            <EditAddressPopup selectedAddressId={selectedAddressId} address={address} />
            {selectedIcon}
            {addressContent}
        </div>
    ) : (
        <div
            className={classes.root_default}
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex="0"
        >
            {addressContent}
        </div>
    );

    return <>{content}</>;
};

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
        street: arrayOf(string)
    }).isRequired,
    isSelected: bool.isRequired,
    onSelection: func.isRequired,
    selectedAddressId: number
};

export default AddressCard;
