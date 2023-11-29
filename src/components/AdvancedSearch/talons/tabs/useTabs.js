import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useAmXsearchContext } from '../../context';
import GET_SEARCH_TABS from '../../queries/getSearchTabs.graphql';
import { useItems } from '../useItems';

import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

const getDefaultActiveTab = (data, config) => {
    if (!data || !data.xsearchProducts) {
        return {
            title: config.amasty_xsearch_product_title,
            typeName: 'XsearchProducts',
            count: 0
        };
    }
    const item = data.xsearchProducts.total_count
        ? data.xsearchProducts
        : Object.values(data).find(v => v.total_count) || data.xsearchProducts;
    const title = config[`amasty_xsearch_${item.code}_title`];

    return {
        title,
        typeName: item.__typename,
        count: item.total_count
    };
};

export const useTabs = () => {
    const [isHasTab, setIsHasTab] = useState(false);
    const [activeTabState, setActiveTabState] = useState(null);
    const location = useLocation();
    const inputText = getSearchParam('query', location);
    const { storeConfig } = useAmXsearchContext() || {};
    const { amasty_xsearch_general_enable_tabs_search_result: isEnabled } = storeConfig || {};

    const { data } = useItems({
        inputText: inputText,
        query: GET_SEARCH_TABS,
        valid: isEnabled
    });

    const initialActiveTab = useMemo(() => getDefaultActiveTab(data, storeConfig), [data, storeConfig]);

    const activeTab = useMemo(() => activeTabState || initialActiveTab, [initialActiveTab, activeTabState]);

    const setActiveTab = useCallback(setActiveTabState, [setActiveTabState]);

    useEffect(() => {
        Object.values(data).forEach(item => {
            if (item.total_count) {
                setIsHasTab(true);
            }
        });
    }, [data]);

    return {
        inputText,
        data,
        setActiveTab,
        activeTab,
        isEnabled,
        isHasTab
    };
};
