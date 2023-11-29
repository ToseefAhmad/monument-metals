import { arrayOf, bool, func, number, array, shape, string } from 'prop-types';
import React from 'react';

import { useSuggestions } from '@magento/peregrine/lib/talons/SearchBar';

import SuggestedCategories from './suggestedCategories';
import SuggestedProducts from './suggestedProducts';

const PRODUCTS_LIMIT = 4;

const Suggestions = props => {
    const {
        displayResult,
        filters,
        products,
        setVisible,
        visible,
        closeSearchBar,
        queryText,
        pageSize,
        setPageSize,
        resultCount
    } = props;
    const { items } = products;

    const talonProps = useSuggestions({
        displayResult,
        filters,
        items,
        setVisible,
        visible
    });
    const { categories, onNavigate, shouldRender } = talonProps;

    // Render null without data
    if (!shouldRender) {
        return null;
    }

    return (
        <>
            <SuggestedCategories closeSearchBar={closeSearchBar} categories={categories} onNavigate={onNavigate} />
            <SuggestedProducts
                closeSearchBar={closeSearchBar}
                resultCount={resultCount}
                pageSize={pageSize}
                setPageSize={setPageSize}
                limit={PRODUCTS_LIMIT}
                onNavigate={onNavigate}
                products={items}
                queryText={queryText}
            />
        </>
    );
};

export default Suggestions;

Suggestions.propTypes = {
    classes: shape({
        heading: string
    }),
    products: shape({
        filters: arrayOf(
            shape({
                filter_items: arrayOf(shape({})),
                name: string.isRequired
            }).isRequired
        ),
        items: arrayOf(shape({}))
    }),
    searchValue: string,
    setVisible: func,
    visible: bool,
    queryText: string,
    displayResult: array,
    filters: array,
    closeSearchBar: func,
    resultCount: number,
    setPageSize: func,
    pageSize: number
};
