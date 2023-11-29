import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { useStoreConfig } from '@app/hooks/useStoreConfig';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Breadcrumbs/breadcrumbs.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Returns props necessary to render a Breadcrumbs component.
 */
export const useBreadcrumbs = ({ categoryId, currentProduct, staticPage, operations }) => {
    const { getBreadcrumbsQuery } = mergeOperations(DEFAULT_OPERATIONS, operations);

    const { data, loading, error } = useQuery(getBreadcrumbsQuery, {
        variables: { category_id: categoryId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId
    });

    const { storeConfig } = useStoreConfig({
        fields: ['category_url_suffix']
    });

    const categoryUrlSuffix = useMemo(() => storeConfig?.category_url_suffix, [storeConfig]);

    const currentCategory = (data && data.category.name) || '';
    const currentCategoryPath = (data && `${data.category.url_path}${categoryUrlSuffix || ''}`) || '#';

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data) {
            const breadcrumbData = data.category.breadcrumbs;

            return (
                breadcrumbData &&
                breadcrumbData
                    .map(category => ({
                        category_level: category.category_level,
                        text: category.category_name,
                        path: getPath(category.category_url_path, categoryUrlSuffix)
                    }))
                    .sort(sortCrumbs)
            );
        }
    }, [categoryUrlSuffix, data, loading]);

    const richSnippet = useMemo(() => {
        const breadcrumbsList = [];
        const baseUrl = globalThis.location.origin;
        const currentPageUrl = globalThis.location.href;
        let currentPosition = 1;

        // Home page breadcrumb
        breadcrumbsList.push({
            '@type': 'ListItem',
            position: currentPosition,
            name: 'Home',
            item: baseUrl
        });

        if (staticPage) {
            // Static page bredcrumb
            breadcrumbsList.push({
                '@type': 'ListItem',
                position: currentPosition + 1,
                name: staticPage,
                item: currentPageUrl
            });
        } else {
            // Category list breadcrumbs
            if (normalizedData) {
                breadcrumbsList.push(
                    ...normalizedData.map(breadcrumb => {
                        const breadcrumbUrl = breadcrumb.path;
                        const url = new URL(breadcrumbUrl, baseUrl);
                        const categoryLevel = breadcrumb.category_level;
                        currentPosition = categoryLevel;

                        return {
                            '@type': 'ListItem',
                            position: categoryLevel,
                            name: breadcrumb.text,
                            item: url.href
                        };
                    }, [])
                );
            }

            // Current category breadcrumb
            if (currentCategory) {
                const currentCategoryUrl = new URL(currentCategoryPath, baseUrl);

                breadcrumbsList.push({
                    '@type': 'ListItem',
                    position: currentPosition + 1,
                    name: currentCategory,
                    item: currentCategoryUrl.href
                });
            }

            // Current product breadcrumb
            if (currentProduct) {
                breadcrumbsList.push({
                    '@type': 'ListItem',
                    position: currentPosition + 2,
                    name: currentProduct,
                    item: currentPageUrl
                });
            }
        }

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbsList
        };
    }, [currentCategory, currentCategoryPath, currentProduct, normalizedData, staticPage]);

    return {
        currentCategory,
        currentCategoryPath,
        isLoading: loading,
        hasError: !!error,
        normalizedData: normalizedData || [],
        richSnippet
    };
};
