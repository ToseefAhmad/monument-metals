import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAmXsearchContext } from '@app/components/AdvancedSearch/context';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

const initialValues = { search_query: '' };

export const useSearchBar = ({ closeSearchBar }) => {
    const { storeConfig, singleProduct } = useAmXsearchContext() || {};
    const {
        amasty_xsearch_general_min_chars: minChars,
        amasty_xsearch_product_redirect_single_product: isRedirectToSingleProduct
    } = storeConfig || {};

    const [valid, setValid] = useState(false);
    const [queryText, setQueryText] = useState(initialValues.search_query);

    const { elementRef, expanded: isAutoCompleteOpen, setExpanded: setIsAutoCompleteOpen } = useDropdown();
    const location = useLocation();
    const history = useHistory();
    const { push } = history || {};

    const handleChange = useCallback(
        value => {
            const hasValue = !!value;
            const isValid = hasValue && value.length >= minChars;

            setValid(isValid);
            setIsAutoCompleteOpen(isValid);
            setQueryText(value ? value : '');
        },
        [minChars, setValid, setIsAutoCompleteOpen]
    );

    // Expand on focus
    const handleFocus = useCallback(() => {
        if (valid) {
            setIsAutoCompleteOpen(true);
        }
    }, [valid, setIsAutoCompleteOpen]);

    // Navigate on submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            if (search_query != null && search_query.trim().length > 0) {
                push(`/search.html?query=${search_query}`);
                setIsAutoCompleteOpen(false);
                closeSearchBar();
            }
        },
        [push, setIsAutoCompleteOpen, closeSearchBar]
    );

    const prepareToSubmit = useCallback(
        search_query => {
            const { enabled, url_key } = singleProduct || {};
            if (isRedirectToSingleProduct && enabled) {
                return push(url_key);
            } else {
                return handleSubmit(search_query);
            }
        },
        [isRedirectToSingleProduct, handleSubmit, push, singleProduct]
    );

    useEffect(() => {
        setIsAutoCompleteOpen(false);
    }, [location, setIsAutoCompleteOpen]);

    return {
        containerRef: elementRef,
        handleChange,
        handleFocus,
        handleSubmit: prepareToSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        setValid,
        valid,
        queryText
    };
};
