import { string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { usePostcode } from '@magento/peregrine/lib/talons/Postcode/usePostcode';

const Postcode = ({ fieldInput, label, placeholder, ...inputProps }) => {
    usePostcode({ fieldInput });
    const { formatMessage } = useIntl();
    const postcodeProps = {
        ...inputProps
    };
    const fieldLabel =
        label ||
        formatMessage({
            id: 'postcode.label',
            defaultMessage: 'ZIP/Postal code'
        });
    const inputPlaceholder =
        placeholder ||
        formatMessage({
            id: 'postcode.placeholder',
            defaultMessage: 'Enter the ZIP/Postal code'
        });

    return (
        <Field id={fieldInput} label={fieldLabel}>
            <TextInput {...postcodeProps} field={fieldInput} id={fieldInput} placeholder={inputPlaceholder} />
        </Field>
    );
};

Postcode.defaultProps = {
    fieldInput: 'postcode'
};

Postcode.propTypes = {
    fieldInput: string,
    label: string,
    placeholder: string
};

export default Postcode;
