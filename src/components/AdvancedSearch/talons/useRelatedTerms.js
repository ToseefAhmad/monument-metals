import { useLocation } from 'react-router-dom';

import { useAmXsearchContext } from '../context';
import GET_RELATED_TERMS from '../queries/getRelatedTerms.graphql';

import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

import { useItems } from './useItems';

export const useRelatedTerms = props => {
    const { productsQty } = props;

    const location = useLocation();
    const inputText = getSearchParam('query', location);

    const { storeConfig } = useAmXsearchContext() || {};
    const {
        amasty_xsearch_general_show_related_terms,
        amasty_xsearch_general_show_related_terms_results: isCountShowing
    } = storeConfig || {};

    const queryName = 'xsearchRelatedTerms';

    const { data } = useItems({
        inputText: inputText,
        query: GET_RELATED_TERMS,
        queryName: queryName,
        valid: true
    });

    const { items } = data || {};

    let isEnabled = Array.isArray(items) && items.length && amasty_xsearch_general_show_related_terms;

    // Showing type "2" is showing terms only when query not founded products
    if (isEnabled && amasty_xsearch_general_show_related_terms === 2 && productsQty) {
        isEnabled = false;
    }

    return {
        items,
        isCountShowing,
        isEnabled
    };
};
