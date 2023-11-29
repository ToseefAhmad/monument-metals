import { object } from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const ProductAddedModalContext = createContext();

export const ProductAddedModalContextProvider = ({ children }) => {
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({});

    return (
        <ProductAddedModalContext.Provider
            value={{ modalData: data, setModalData: setData, showModal: modal, setShowModal: setModal }}
        >
            {children}
        </ProductAddedModalContext.Provider>
    );
};

export const useProductAddedModalContext = () => useContext(ProductAddedModalContext);

ProductAddedModalContextProvider.propTypes = {
    children: object
};
