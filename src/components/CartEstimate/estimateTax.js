import { Form } from 'informed';
import { func } from 'prop-types';
import React from 'react';

import { useEstimateTax } from '@app/components/CartEstimate/useEstimateTax';
import Country from '@app/components/overrides/Country';
import Postcode from '@app/components/overrides/Postcode';
import Region from '@app/components/overrides/Region';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const EstimateTax = ({ fetchCartDetails }) => {
    const { handleFormChanges, setFormApi } = useEstimateTax({ fetchCartDetails });

    return (
        <Form getApi={setFormApi} initialValues={{ country: DEFAULT_COUNTRY_CODE }} onValueChange={handleFormChanges}>
            <Country validate={isRequired} validateOnChange />
            <Region
                validate={isRequired}
                validateOnChange
                fieldInput={'region[region]'}
                fieldSelect={'region[region_id]'}
                optionValueKey={'id'}
            />
            <Postcode validate={isRequired} validateOnChange />
        </Form>
    );
};

EstimateTax.propTypes = {
    fetchCartDetails: func
};

export default EstimateTax;
