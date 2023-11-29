import { useQuery } from '@apollo/client';
import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './billingInformation.module.css';
import { GET_COUNTRY_BY_ID } from './orderDetails.gql';

const BillingInformation = props => {
    const { data, classes: propsClasses } = props;
    const { city, country_code, firstname, lastname, postcode, region, street, telephone } = data;
    const classes = useStyle(defaultClasses, propsClasses);

    const { data: countryData } = useQuery(GET_COUNTRY_BY_ID, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            country_code
        }
    });

    const additionalAddressString = `${city}, ${region} ${postcode}`;
    const fullName = `${firstname} ${lastname}`;
    const country = countryData ? countryData.country.full_name_english : null;

    const streetRows = street.map((row, index) => {
        return (
            <div className={classes.streetRow} key={index}>
                {row}
            </div>
        );
    });

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage id="orderViewPage.billingInformationLabel" defaultMessage="Billing info" />
            </div>
            <span className={classes.name}>{fullName}</span>
            {streetRows}
            <div className={classes.additionalAddress}>{additionalAddressString}</div>
            <div className={classes.country}>{country}</div>
            <div className={classes.telephone}>{telephone}</div>
        </div>
    );
};

export default BillingInformation;

BillingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string)
    })
};
