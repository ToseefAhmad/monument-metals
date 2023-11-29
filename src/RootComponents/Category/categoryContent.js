import { func, number, string } from 'prop-types';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Grid, List } from '@app/components/MonumentIcons';
import NoProductBlock from '@app/components/NoProductBlock/noProductBlock';
import FilterModalOpenButton, { FilterModalOpenButtonShimmer } from '@app/components/overrides/FilterModalOpenButton';
import Gallery from '@app/components/overrides/Gallery';
import GalleryListItemShimmer from '@app/components/overrides/Gallery/listItem.shimmer.js';
import ProductSort, { ProductSortShimmer } from '@app/components/overrides/ProductSort';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';

import classes from './category.module.css';
import ToggleViewButton from './toggleViewButton';
import ToggleViewButtonShimmer from './toggleViewButton.shimmer';
import { useCategoryContent } from './useCategoryContent';

const FilterModal = React.lazy(() =>
    import(/* webpackChunkName: "filterModal" */ '@magento/venia-ui/lib/components/FilterModal')
);
const FilterSidebar = React.lazy(() =>
    import(/* webpackChunkName: "filterSidebar" */ '@app/components/overrides/FilterSidebar')
);

const SESSION_STORAGE_GRID_VIEW = 'grid-view';

const CategoryContent = ({ categoryId, setNoProductPage, categoryName }) => {
    const {
        filters,
        totalPagesFromData,
        productItems,
        isLoading,
        sortProps,
        loadPrevItems,
        loadMoreItems,
        isLoadPrev,
        isLoadMore,
        isLoadingPrev,
        isLoadingMore,
        handleProductClick
    } = useCategoryContent({
        categoryId
    });

    const defaultView = !localStorage.getItem(SESSION_STORAGE_GRID_VIEW)
        ? true
        : localStorage.getItem(SESSION_STORAGE_GRID_VIEW) === 'true';

    const isNoProductsFound = !totalPagesFromData && !isLoading;
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const [isGridView, setIsGridView] = useState(defaultView);
    const { isMobileScreen } = useScreenSize();

    useEffect(() => {
        setNoProductPage(isNoProductsFound);
        // clean up to prevent to moving to next stance
        return () => {
            setNoProductPage(false);
        };
    }, [isNoProductsFound, setNoProductPage]);

    useEffect(() => {
        if (isMobileScreen) {
            setIsGridView(true);
        }
        localStorage.setItem('grid-view', JSON.stringify(isGridView));
    }, [isGridView, isMobileScreen]);

    const setOpenSidebar = useCallback(() => {
        setIsOpenSidebar(!isOpenSidebar);
    }, [isOpenSidebar, setIsOpenSidebar]);

    const setGridView = useCallback(() => {
        setIsGridView(!isGridView);
    }, [isGridView]);

    const sidebarRef = useRef(null);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = totalPagesFromData && !isLoading && filters && filters.length;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && !isLoading;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : isLoading ? (
        <ProductSortShimmer />
    ) : null;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} toggleAction={setOpenSidebar} />
    ) : isLoading ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? <FilterModal filters={filters} /> : null;

    const sidebar = filters && filters.length ? <FilterSidebar filters={filters} isOpen={isOpenSidebar} /> : null;

    const maybeSortGridView = totalPagesFromData ? (
        <div className={classes.viewSwitcher}>
            <ToggleViewButton changeView={isGridView} onPress={setGridView} icon={Grid} />
            <ToggleViewButton changeView={!isGridView} onPress={setGridView} icon={List} />
        </div>
    ) : !totalPagesFromData && isLoading ? (
        <ToggleViewButtonShimmer />
    ) : null;

    const content = useMemo(() => {
        if (isLoading && isGridView) {
            return <GalleryShimmer items={Array.from({ length: 40 }).fill(null)} />;
        }

        if (isLoading && !isGridView) {
            return <GalleryListItemShimmer items={Array.from({ length: 40 }).fill(null)} />;
        }

        if (isNoProductsFound) {
            return <NoProductBlock productName={categoryName} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery
                onProductClick={handleProductClick}
                items={productItems}
                isGridView={isGridView}
                loadPrevItems={loadPrevItems}
                loadMoreItems={loadMoreItems}
                isLoadPrev={isLoadPrev}
                isLoadMore={isLoadMore}
                isLoadingMore={isLoadingMore}
                isLoadingPrev={isLoadingPrev}
            />
        ) : null;

        return (
            <>
                <section className={classes.gallery}>{gallery}</section>
            </>
        );
    }, [
        categoryName,
        handleProductClick,
        isGridView,
        isLoadMore,
        isLoadPrev,
        isLoading,
        isLoadingMore,
        isLoadingPrev,
        isNoProductsFound,
        loadMoreItems,
        loadPrevItems,
        productItems,
        totalPagesFromData
    ]);

    const maybeFilterModal = (
        <div ref={sidebarRef} className={classes.topFilter} id="filterModal">
            <Suspense fallback={null}>{shouldRenderSidebarContent ? sidebar : null}</Suspense>
        </div>
    );

    const categoryRoot = !isNoProductsFound ? classes.root : classes.rootNoProducts;

    return (
        <>
            <article className={categoryRoot}>
                <div className={classes.contentWrapper}>
                    <div className={classes.categoryContent}>
                        {!isNoProductsFound && (
                            <div className={classes.toolbarSectionWrapper}>
                                <div className={classes.toolbarSection}>
                                    <div className={classes.heading}>
                                        {maybeSortGridView}
                                        <div className={classes.headerButtons}>
                                            {maybeSortButton}
                                            {maybeFilterButtons}
                                        </div>
                                    </div>
                                    {maybeFilterModal}
                                </div>
                            </div>
                        )}
                        {content}
                        <Suspense fallback={null}>{filtersModal}</Suspense>
                    </div>
                </div>
            </article>
        </>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    categoryId: number,
    setNoProductPage: func,
    categoryName: string
};
