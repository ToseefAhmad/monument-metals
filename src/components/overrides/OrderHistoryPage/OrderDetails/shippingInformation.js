import { useQuery } from '@apollo/client';
import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GET_COUNTRY_BY_ID } from './orderDetails.gql';
import classes from './shippingInformation.module.css';

const ShippingInformation = ({ data }) => {
    const {
        city = null,
        country_code = null,
        firstname = null,
        lastname = null,
        postcode = null,
        region = null,
        street = [],
        telephone = null
    } = data;

    const additionalAddressString = `${city}, ${region} ${postcode}`;
    const fullName = `${firstname} ${lastname}`;

    const { data: countryData } = useQuery(GET_COUNTRY_BY_ID, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            country_code
        },
        skip: !country_code
    });

    const country = countryData ? countryData.country.full_name_english : null;

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    let shippingContentElement;
    if (data) {
        shippingContentElement = (
            <>
                <div className={classes.name}>{fullName}</div>
                {streetRows}
                <div className={classes.additionalAddress}>{additionalAddressString}</div>
                <div className={classes.country}>{country}</div>
                <div className={classes.telephone}>{telephone}</div>
            </>
        );
    } else {
        shippingContentElement = (
            <FormattedMessage id="orderDetails.noShippingInformation" defaultMessage="No shipping information" />
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage id="orderViewPage.shippingInformationLabel" defaultMessage="Shipping info" />
            </div>
            {shippingContentElement}
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string),
        telephone: string
    })
};
