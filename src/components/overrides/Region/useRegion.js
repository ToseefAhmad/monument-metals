import { useQuery } from '@apollo/client';
import { useFieldApi } from 'informed';
import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
/**
 * The useRegion talon handles logic for:
 *
 *  * Resetting the region field value when the country changes.
 *  * Querying for available regions for a country and rendering them.
 *
 * @param {Object} props
 * @param {string} props.countryCodeField
 * @param {string} props.fieldInput - the reference field path for free form text input Defaults to "region".
 * @param {string} props.fieldSelect - the reference field path for selectable list of regions. Defaults to "region".
 * @param {string} props.optionValueKey - the key used to get the value for the field. Defaults to "code"
 * @param {GraphQLAST} props.queries.getRegionsQuery - query to fetch regions for a country.
 *
 * @return {RegionTalonProps}
 */
export const useRegion = props => {
    const {
        countryCodeField = 'country',
        fieldInput = 'region',
        fieldSelect = 'region',
        optionValueKey = 'code',
        queries: { getRegionsQuery }
    } = props;
    const { formatMessage } = useIntl();

    const hasInitialized = useRef(false);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const regionInputFieldApi = useFieldApi(fieldInput);
    const regionSelectFieldApi = useFieldApi(fieldSelect);

    const { data, loading } = useQuery(getRegionsQuery, {
        variables: { countryCode: country },
        skip: !country
    });

    // Reset region value when country changes. Because of how Informed sets
    // InitialValues, we want to skip the first state change of the value being
    // Initialized.
    useEffect(() => {
        if (country && !loading) {
            if (hasInitialized.current) {
                regionInputFieldApi.exists() && regionInputFieldApi.setValue();
                regionSelectFieldApi.exists() && regionSelectFieldApi.setValue();
            } else {
                hasInitialized.current = true;
            }
        }
    }, [country, regionInputFieldApi, regionSelectFieldApi, loading]);

    let formattedRegionsData = [
        {
            label: formatMessage({
                id: 'region.loading',
                defaultMessage: 'Loading Regions...'
            }),
            value: ''
        }
    ];
    const placeholder = formatMessage({
        id: 'region.placeholder',
        defaultMessage: 'Select the State/Province'
    });

    if (data) {
        const { country } = data;
        const { available_regions: availableRegions } = country;
        if (availableRegions) {
            formattedRegionsData = availableRegions.map(region => ({
                key: region.id,
                label: region.name,
                value: region[optionValueKey]
            }));
            formattedRegionsData.unshift({
                disabled: true,
                hidden: true,
                label: placeholder,
                value: ''
            });
        } else {
            formattedRegionsData = [];
        }
    }

    return {
        loading,
        regions: formattedRegionsData,
        placeholder
    };
};

/** JSDocs type definitions */

/**
 * @typedef {Object} RegionTalonProps
 *
 * @property {boolean} loading whether the regions are loading
 * @property {Array<Region>} regions array of formatted regions for the country
 *
 */

/**
 * @typedef {Object} Region
 *
 * @property {number} key the id of the region
 * @property {String} label the label of the region
 * @property {String} value the value of the region
 */
