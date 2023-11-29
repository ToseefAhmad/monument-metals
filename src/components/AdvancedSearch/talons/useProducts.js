import { String } from 'prop-types';
import { useEffect } from 'react';

import { URLS } from '../constants';
import { useAmXsearchContext } from '../context';
import GET_SEARCH_PRODUCTS from '../queries/getSearchProducts.graphql';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useItems } from './useItems';

const QUERY_NAME = 'xsearchProducts';

export const useProducts = props => {
    const { inputText } = props;
    const { setSingleProduct } = useAmXsearchContext();

    const { data, loading } = useItems({
        valid: true,
        inputText: inputText,
        query: GET_SEARCH_PRODUCTS,
        queryName: QUERY_NAME
    });

    const { items, total_count } = data || {};
    const isProductsShowed = Array.isArray(items) && items.length;
    const viewAllUrl = resourceUrl(`${URLS.SEARCHURLPARAMS}${inputText}`);

    useEffect(() => {
        if (total_count === 1) {
            const product = { ...items[0] };
            const { url_key, url_suffix } = product;
            const url = resourceUrl(`/${url_key}${url_suffix}`);

            setSingleProduct({
                enabled: true,
                url_key: url
            });
        } else {
            setSingleProduct(false);
        }
    }, [setSingleProduct, items, total_count]);

    return {
        viewAllUrl,
        total_count,
        items,
        loading,
        isProductsShowed
    };
};

useProducts.propTypes = {
    inputText: String
};
