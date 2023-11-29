import { func, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';

import { GET_COUNTRIES_QUERY } from './country.gql';

const Country = ({ field, label, translationId, ...inputProps }) => {
    const { countries, loading } = useCountry({
        queries: {
            getCountriesQuery: GET_COUNTRIES_QUERY
        }
    });
    const { formatMessage } = useIntl();
    const selectProps = {
        disabled: loading,
        field,
        items: countries,
        ...inputProps
    };

    return (
        <Field id={field} label={formatMessage({ id: translationId, defaultMessage: label })}>
            <Select {...selectProps} id={field} />
        </Field>
    );
};

Country.defaultProps = {
    field: 'country',
    label: 'Country',
    translationId: 'country.label'
};

Country.propTypes = {
    field: string,
    label: string,
    translationId: string,
    validate: func,
    initialValue: string
};

export default Country;
