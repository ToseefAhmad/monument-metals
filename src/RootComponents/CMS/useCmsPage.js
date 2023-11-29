import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { useStoreConfig } from '@app/hooks/useStoreConfig';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './cmsPage.gql';

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {object} props
 * @param {object} props.id - CMS Page ID
 * @param {object} props.operations - Collection of GraphQL queries
 * @param {object} props.operations.getCmsPage - Query for getting a CMS Page
 * @returns {{shouldShowLoadingIndicator: *, hasContent: *, cmsPage: *, error: *}}
 */
export const useCmsPage = props => {
    const { identifier } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCMSPageQuery } = operations;

    const { loading, error, data } = useQuery(getCMSPageQuery, {
        variables: {
            identifier: identifier
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { storeConfig } = useStoreConfig({ fields: ['root_category_id'] });

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    // To prevent loading indicator from getting stuck, unset on unmount.
    useEffect(() => {
        return () => {
            setPageLoading(false);
        };
    }, [setPageLoading]);

    // Ensure we mark the page as loading while we check the network for updates
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const shouldShowLoadingIndicator = loading && !data;

    const cmsPage = data ? data.cmsPage : null;
    const rootCategoryId = storeConfig?.root_category_id;

    // Only render <RichContent /> if the page isn't empty and doesn't contain
    // The default CMS Page text. We do this so there is at least a useable home
    // Page by default, the category list component.
    const hasContent = useMemo(() => {
        return (
            cmsPage &&
            cmsPage.content &&
            cmsPage.content.length > 0 &&
            !cmsPage.content.includes('CMS homepage content goes here.')
        );
    }, [cmsPage]);

    const richSnippet = useMemo(() => {
        if (!hasContent && !cmsPage) {
            return null;
        }

        const baseUrl = globalThis.location.origin;

        return {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: cmsPage.meta_title || cmsPage.title,
            author: {
                '@type': 'Organization',
                name: 'Monument Metals',
                url: baseUrl
            }
        };
    }, [cmsPage, hasContent]);

    return {
        cmsPage,
        error,
        hasContent,
        rootCategoryId,
        shouldShowLoadingIndicator,
        richSnippet,
        loading
    };
};
