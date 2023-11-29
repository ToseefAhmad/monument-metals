import { bool, func } from 'prop-types';
import React from 'react';

import { useAmXsearchContext } from '../../context';
import ProductsBlock from '../ProductsBlock';
import ResultsBlock from '../ResultsBlock';

import defaultClasses from '@app/components/overrides/SearchBar/Autocomplete/autocomplete.module.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import xSearchClasses from './autocomplete.module.css';

const Autocomplete = props => {
    const { valid, visible, closeSearchBar } = props;

    const classes = mergeClasses(defaultClasses, xSearchClasses);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;

    const { storeConfig } = useAmXsearchContext() || {};
    const { amasty_xsearch_product_position } = storeConfig || {};

    return (
        <div className={rootClassName}>
            <ResultsBlock closeSearchBar={closeSearchBar} visible={visible} valid={valid} />
            {valid && <ProductsBlock closeSearchBar={closeSearchBar} position={amasty_xsearch_product_position} />}
        </div>
    );
};

export default Autocomplete;

Autocomplete.propTypes = {
    valid: bool,
    visible: bool,
    closeSearchBar: func.isRequired
};
