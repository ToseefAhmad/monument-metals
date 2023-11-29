import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { URLS } from '../constants';
import { useAmXsearchContext } from '../context';

import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

export const useXsearchHeader = () => {
    let styles = {};

    const magentoRoute = useMagentoRoute({ skipRedirect: true });
    const location = useLocation();
    const history = useHistory();

    const { storeConfig } = useAmXsearchContext();
    const {
        amasty_xsearch_general_four_zero_four_redirect,
        amasty_xsearch_layout_text,
        amasty_xsearch_layout_hover_text,
        amasty_xsearch_layout_highlight,
        amasty_xsearch_layout_hover,
        amasty_xsearch_layout_border,
        amasty_xsearch_layout_background,
        amasty_xsearch_layout_enabled
    } = storeConfig || {};

    if (amasty_xsearch_layout_enabled) {
        styles = {
            '--amxsearch-color-text': '#' + amasty_xsearch_layout_text,
            '--amxsearch-color-text-hover': '#' + amasty_xsearch_layout_hover_text,
            '--amxsearch-color-border': '#' + amasty_xsearch_layout_border,
            '--amxsearch-color-highlight': '#' + amasty_xsearch_layout_highlight,
            '--amxsearch-color-hover': '#' + amasty_xsearch_layout_hover,
            '--amxsearch-color-background': '#' + amasty_xsearch_layout_background
        };
    }

    // Get search query from url if page not founded
    useEffect(() => {
        if (
            magentoRoute.isNotFound &&
            amasty_xsearch_general_four_zero_four_redirect &&
            typeof location.key === 'undefined' &&
            location.pathname !== URLS.SEARCHURL
        ) {
            const url = resourceUrl(
                `${URLS.SEARCHURLPARAMS}${location.pathname.substring(location.pathname.lastIndexOf('/') + 1)}`
            );

            history.push(url);
        }
    }, [magentoRoute, location, history, amasty_xsearch_general_four_zero_four_redirect]);

    return {
        styles,
        magentoRoute
    };
};
