import { object, array, node, string, oneOfType } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useLabels } from '@app/hooks/useLabels';

const AmProductLabelContext = createContext(undefined);
const { Provider } = AmProductLabelContext;

const AmProductLabelProvider = props => {
    const { products, productsFromVariants, children, mode } = props;

    const talonProps = useLabels({
        products,
        productsFromVariants,
        mode
    });

    const { error } = talonProps;

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

AmProductLabelProvider.propTypes = {
    products: oneOfType([object, array]),
    productsFromVariants: object,
    children: node,
    mode: string
};

export default AmProductLabelProvider;

export const useAmProductLabelContext = () => useContext(AmProductLabelContext);
