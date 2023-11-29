import { func, number, oneOfType, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import { GET_REGIONS_QUERY } from './region.gql';

/**
 * Form component for Region that is seeded with backend data.
 *
 * @param {string} props.optionValueKey - Key to use for returned option values. In a future release, this will be removed and hard-coded to use "id" once GraphQL has resolved MC-30886.
 */
const Region = ({ countryCodeField, fieldInput, fieldSelect, label, translationId, optionValueKey, ...inputProps }) => {
    const { loading, regions, placeholder } = useRegion({
        countryCodeField,
        fieldInput,
        fieldSelect,
        optionValueKey,
        queries: { getRegionsQuery: GET_REGIONS_QUERY }
    });
    const { formatMessage } = useIntl();

    const regionProps = {
        disabled: loading,
        ...inputProps
    };

    const regionField =
        regions.length || loading ? (
            <Select {...regionProps} field={fieldSelect} id={fieldSelect} items={regions} />
        ) : (
            <TextInput {...regionProps} field={fieldInput} id={fieldInput} placeholder={placeholder} />
        );

    return (
        <Field
            id={regions.length || loading ? fieldSelect : fieldInput}
            label={formatMessage({ id: translationId, defaultMessage: label })}
        >
            {regionField}
        </Field>
    );
};

Region.defaultProps = {
    countryCodeField: 'country',
    fieldInput: 'region',
    fieldSelect: 'region',
    label: 'State/Province',
    translationId: 'region.label',
    optionValueKey: 'code'
};

Region.propTypes = {
    countryCodeField: string,
    fieldInput: string,
    fieldSelect: string,
    label: string,
    translationId: string,
    optionValueKey: string,
    validate: func,
    initialValue: oneOfType([number, string])
};

export default Region;
