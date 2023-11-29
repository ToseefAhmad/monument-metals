import { useFormApi } from 'informed';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

export const useSearchBar = () => {
    const { setValue, submitForm, getValue } = useFormApi();
    const location = useLocation();
    const searchQuery = getSearchParam('query', location).replace(/\.[^.]*$/, '');
    const inputText = getValue('search_query');

    const setInputSearchValue = useCallback(
        value => {
            setValue('search_query', value);
            submitForm();
        },
        [setValue, submitForm]
    );

    // Compare search input value with query and set similar
    useEffect(() => {
        if (searchQuery && searchQuery !== inputText) {
            setValue('search_query', inputText);
        }
    }, [searchQuery, setValue, inputText]);

    return {
        setInputSearchValue
    };
};
