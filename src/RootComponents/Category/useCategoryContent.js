import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useStoreConfig } from '@app/hooks/useStoreConfig';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { useSort } from '@magento/peregrine/lib/hooks/useSort';
import { getFiltersFromSearch, getFilterInput } from '@magento/peregrine/lib/talons/FilterModal/helpers';

import DEFAULT_OPERATIONS from './categoryContent.gql';
import { useInStockCategory } from './useInStockCategory';

export const useCategoryContent = ({ categoryId }) => {
    const {
        getProductFiltersByCategoryQuery,
        getCategoryListQuery,
        getCategoryQuery,
        getFilterInputsQuery
    } = DEFAULT_OPERATIONS;
    const { getProductCategories, trackProductImpression, trackProductClick } = useTracking();

    const [getFilters, { data: filterData }] = useLazyQuery(getProductFiltersByCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const handleTracking = useCallback(
        data => {
            if (data.products && data.products.items.length) {
                const currencyCode = data.products.items[0].price_range.maximum_price.final_price.currency;
                trackProductImpression({
                    currencyCode,
                    list: 'Category Page',
                    products: data.products.items.map((product, index) => ({
                        sku: product.sku,
                        price: product.price_range.maximum_price.final_price.value,
                        currency: product.price_range.maximum_price.final_price.currency,
                        category: product.categories ? getProductCategories(product.categories) : '',
                        position: index + 1,
                        name: product.name,
                        quantity: 1
                    }))
                });
            }
        },
        [getProductCategories, trackProductImpression]
    );

    const [runQuery, { called: categoryCalled, loading: categoryLoading, error, data }] = useLazyQuery(
        getCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            onCompleted: data => {
                handleTracking(data);
            }
        }
    );

    const filters = filterData ? filterData.products.aggregations : null;
    const totalPagesFromData = data ? data.products.page_info.total_pages : null;
    const totalCount = data ? data.products.total_count : null;

    const { storeConfig } = useStoreConfig({
        fields: ['grid_per_page']
    });

    const { data: getCategoriesData } = useQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId,
        variables: {
            id: categoryId
        }
    });
    const { isInStockCategory, isInStockCategoriesLoading, inStockCategoryIds } = useInStockCategory({
        getCategoryListQuery,
        getCategoriesData
    });

    useEffect(() => {
        if (inStockCategoryIds) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        in: inStockCategoryIds
                    }
                }
            });
        } else if (categoryId) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    }
                }
            });
        }
    }, [categoryId, inStockCategoryIds, getFilters]);

    const pageSize = storeConfig?.grid_per_page;
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort();
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [initialPage, setInitialPage] = useState(currentPage);

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { search } = useLocation();

    const isBackgroundLoading = !!data && categoryLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const { called: introspectionCalled, data: introspectionData, loading: introspectionLoading } = useQuery(
        getFilterInputsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    // Create a type map we can reference later to ensure we pass valid args
    // To the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    const newFilters = useMemo(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category id for the current category page regardless of the
        // Applied filters. Follow-up in PWA-404.

        if (isInStockCategory) {
            newFilters['category_id'] = { in: inStockCategoryIds };
            newFilters['in_stock'] = { eq: true };
        } else {
            newFilters['category_id'] = { eq: String(categoryId) };
        }

        return newFilters;
    }, [filterTypeMap, categoryId, inStockCategoryIds, isInStockCategory, pageSize, search]);

    useEffect(() => {
        setLoadedMoreItems([]);
        setLoadedPrevItems([]);
    }, [categoryId]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        if (pageSize && newFilters) {
            runQuery({
                variables: {
                    currentPage: Number(initialPage),
                    id: Number(categoryId),
                    filters: newFilters,
                    pageSize: Number(pageSize),
                    sort: { [currentSort.sortAttribute]: currentSort.sortDirection, is_salable: 'DESC' }
                }
            });
        }
    }, [initialPage, currentSort, categoryId, newFilters, pageSize, runQuery]);

    // Load more and prev products functionality
    const [loadedPrevItems, setLoadedPrevItems] = useState([]);
    const [loadedMoreItems, setLoadedMoreItems] = useState([]);
    const [isLoadMore, setIsLoadMore] = useState(null);
    const [isLoadPrev, setIsLoadPrev] = useState(false);
    const [currentPrevPage, setCurrentPrevPage] = useState(currentPage);

    const [runQueryLoadMore, queryResponseLoadMore] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            handleTracking(data);
        }
    });
    const { data: loadedMoreItemsData, loading: loadedMoreItemsLoading } = queryResponseLoadMore;

    const [runQueryLoadPrev, queryResponseLoadPrev] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            handleTracking(data);
        }
    });
    const { data: loadedPrevItemsData, loading: loadedPrevItemsLoading } = queryResponseLoadPrev;

    useEffect(() => {
        const loadedMoreItems =
            !loadedMoreItemsLoading && loadedMoreItemsData ? loadedMoreItemsData.products.items : null;

        loadedMoreItems && setLoadedMoreItems(loadedItems => [...loadedItems, ...loadedMoreItems]);
    }, [loadedMoreItemsData, loadedMoreItemsLoading]);

    useEffect(() => {
        const loadedPrevItems =
            !loadedPrevItemsLoading && loadedPrevItemsData ? loadedPrevItemsData.products.items : null;

        loadedPrevItems && setLoadedPrevItems(loadedItems => [...loadedPrevItems, ...loadedItems]);
    }, [loadedPrevItemsData, loadedPrevItemsLoading]);

    const loadMoreItems = useCallback(() => {
        const nextPageNumber = currentPage + 1;

        runQueryLoadMore({
            variables: {
                currentPage: Number(nextPageNumber),
                id: Number(categoryId),
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection, is_salable: 'DESC' }
            }
        });
        setCurrentPage(nextPageNumber);
    }, [currentPage, runQueryLoadMore, categoryId, newFilters, pageSize, currentSort, setCurrentPage]);

    useEffect(() => {
        setIsLoadMore(totalPages > currentPage);
    }, [currentPage, totalPages]);

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const loadPrevItems = useCallback(() => {
        const prevPageNumber = currentPrevPage - 1;

        runQueryLoadPrev({
            variables: {
                currentPage: Number(prevPageNumber),
                id: Number(categoryId),
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection, is_salable: 'DESC' }
            }
        });
        setCurrentPrevPage(prevPageNumber);
    }, [currentPrevPage, currentSort, categoryId, newFilters, pageSize, runQueryLoadPrev]);

    const handleProductClick = useCallback(
        item => {
            trackProductClick({
                listName: 'Category Page',
                product: {
                    sku: item.sku,
                    name: item.name,
                    price: item.price_range.maximum_price.final_price.value,
                    currency: item.price_range.maximum_price.final_price.currency,
                    category: getProductCategories(item.categories)
                }
            });
        },
        [getProductCategories, trackProductClick]
    );

    useEffect(() => {
        if (currentPrevPage > 1) {
            setIsLoadPrev(true);
        } else {
            setIsLoadPrev(false);
        }
    }, [currentPage, currentPrevPage]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !categoryLoading && !data && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, categoryLoading, setCurrentPage, data]);

    // Reset the current page back to one (1) when the search string, filters
    // Or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !== currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !== currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            setInitialPage(1);
            setLoadedMoreItems([]);
            setLoadedPrevItems([]);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    const placeholderItems = Array.from({ length: pageSize }).fill(null);
    const productItems = data ? data.products.items : placeholderItems;
    const productItemsWithLoaded = [...loadedPrevItems, ...productItems, ...loadedMoreItems];

    const metaDescription =
        data && data.category && data.category.meta_description ? data.category.meta_description : '';

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading =
        (introspectionCalled && !categoryCalled) ||
        (categoryLoading && !data) ||
        introspectionLoading ||
        isInStockCategoriesLoading;

    useScrollTopOnChange(initialPage);

    return {
        filters,
        totalCount,
        totalPagesFromData,
        ids: inStockCategoryIds,
        error,
        productItems: productItemsWithLoaded,
        isLoading: loading,
        metaDescription,
        pageControl,
        sortProps,
        currentPage,
        loadPrevItems,
        loadMoreItems,
        isLoadPrev,
        isLoadMore,
        isLoadingPrev: loadedPrevItemsLoading,
        isLoadingMore: loadedMoreItemsLoading,
        handleProductClick
    };
};
