import { node } from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

import { useConfigs } from './talons/useConfigs';

const AmXsearchContext = createContext();
const { Provider } = AmXsearchContext;

const AmXsearchProvider = props => {
    const { children } = props;

    const [singleProduct, setSingleProduct] = useState({ enabled: false });

    const { storeConfig, error } = useConfigs();

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }

        /* eslint-disable no-console */
        console.log('Check if Amasty modules has been installed!');
    }

    const contextValue = {
        storeConfig,
        singleProduct,
        setSingleProduct
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

AmXsearchProvider.propTypes = {
    children: node.isRequired
};

export default AmXsearchProvider;

export const useAmXsearchContext = () => useContext(AmXsearchContext);
