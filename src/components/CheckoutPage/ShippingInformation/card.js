import { arrayOf, shape, string } from 'prop-types';
import React from 'react';

import classes from './card.module.css';

const Card = ({ shippingData }) => {
    const {
        city,
        country: { label: country },
        email,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        telephone
    } = shippingData;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region} ${postcode} ${country}`;

    return (
        <div className={classes.root}>
            <span>{email}</span>
            <span>{nameString}</span>
            <span>{telephone}</span>
            <div className={classes.address}>
                {streetRows}
                <span>{additionalAddressString}</span>
            </div>
        </div>
    );
};

Card.propTypes = {
    shippingData: shape({
        city: string.isRequired,
        country: shape({
            label: string.isRequired
        }).isRequired,
        email: string.isRequired,
        firstname: string.isRequired,
        lastname: string.isRequired,
        postcode: string.isRequired,
        region: shape({
            region: string.isRequired
        }).isRequired,
        street: arrayOf(string).isRequired,
        telephone: string.isRequired
    }).isRequired
};

export default Card;
