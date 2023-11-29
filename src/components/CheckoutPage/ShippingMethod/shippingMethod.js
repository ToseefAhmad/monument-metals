import { bool, func } from 'prop-types';
import React from 'react';

import ShippingForm from './shippingForm';
import ShippingMethodShimmer from './shippingMethod.shimmer';
import { useShippingMethod } from './useShippingMethod';

const ShippingMethod = ({ onSave, pageIsUpdating, setPageIsUpdating, shouldSubmit }) => {
    const { handleSubmit, isLoading, selectedShippingMethod, shippingMethods, setFormApi } = useShippingMethod({
        onSave,
        setPageIsUpdating,
        shouldSubmit
    });

    if (isLoading) {
        return <ShippingMethodShimmer />;
    }

    const lowestCostShippingMethodSerializedValue = shippingMethods.length ? shippingMethods[0].serializedValue : '';

    const initialValues = {
        shipping_method: selectedShippingMethod
            ? selectedShippingMethod.serializedValue
            : lowestCostShippingMethodSerializedValue
    };

    return (
        <ShippingForm
            getApi={setFormApi}
            formInitialValues={initialValues}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            pageIsUpdating={pageIsUpdating}
            shippingMethods={shippingMethods}
        />
    );
};

ShippingMethod.propTypes = {
    onSave: func.isRequired,
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired,
    shouldSubmit: bool
};

export default ShippingMethod;
