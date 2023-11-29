import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import TabsButton from '@app/components/AdvancedSearch/components/TabsButton';
import Tabs from '@app/components/AdvancedSearch/components/TabsContent/tabs';
import { useTabs } from '@app/components/AdvancedSearch/talons/tabs/useTabs';
import BackToTop from '@app/components/BackToTop';
import { Grid, List } from '@app/components/MonumentIcons';
import NoProductBlock from '@app/components/NoProductBlock/noProductBlock';
import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import FilterModalOpenButton, { FilterModalOpenButtonShimmer } from '@app/components/overrides/FilterModalOpenButton';
import { GalleryShimmer } from '@app/components/overrides/Gallery';
import GalleryListItemShimmer from '@app/components/overrides/Gallery/listItem.shimmer.js';
import { Meta, StoreTitle, Title, OgMeta } from '@app/components/overrides/Head';
import ProductSort, { ProductSortShimmer } from '@app/components/overrides/ProductSort';
import ToggleViewButton from '@app/RootComponents/Category/toggleViewButton';
import ToggleViewButtonShimmer from '@app/RootComponents/Category/toggleViewButton.shimmer';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './searchPage.module.css';

const FilterModal = React.lazy(() =>
    import(/* webpackChunkName: "filterModal" */ '@magento/venia-ui/lib/components/FilterModal')
);
const FilterSidebar = React.lazy(() =>
    import(/* webpackChunkName: "filterSidebar" */ '@app/components/overrides/FilterSidebar')
);

const SESSION_STORAGE_GRID_VIEW = 'grid-view';
const PAGE_TITLE = 'Search page';

const SearchPage = () => {
    const {
        data,
        error,
        filters,
        loading,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps,
        handleProductClick
    } = useSearchPage();
    const { formatMessage } = useIntl();

    const defaultView = !localStorage.getItem(SESSION_STORAGE_GRID_VIEW)
        ? true
        : localStorage.getItem(SESSION_STORAGE_GRID_VIEW) === 'true';
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const [isGridView, setIsGridView] = useState(defaultView);

    useEffect(() => {
        localStorage.setItem(SESSION_STORAGE_GRID_VIEW, JSON.stringify(isGridView));
    }, [isGridView]);

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

    const { activeTab, setActiveTab } = useTabs();
    const isNoProductBlock = !activeTab?.count && data?.products?.items?.length === 0;

    const content = useMemo(() => {
        if (!data && loading && isGridView) {
            return (
                <>
                    <section className={classes.gallery}>
                        <GalleryShimmer items={Array.from({ length: 40 }).fill(null)} />
                    </section>
                    <section className={classes.pagination} />
                </>
            );
        }

        if (loading && !isGridView) {
            return <GalleryListItemShimmer items={Array.from({ length: 40 }).fill(null)} />;
        }

        if (!data && error) {
            return (
                <div className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={'No results found. The search term may be missing or invalid.'}
                    />
                </div>
            );
        }

        if (!data) {
            return null;
        }

        if (isNoProductBlock) {
            return <NoProductBlock productName={searchTerm} />;
        } else {
            return (
                <>
                    <section className={classes.gallery}>
                        <Tabs
                            sortProps={sortProps}
                            products={data.products.items}
                            pageControl={pageControl}
                            activeTab={activeTab}
                            isGridView={isGridView}
                        />
                    </section>
                    <section className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </section>
                    <BackToTop topOffset={500} />
                </>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, loading, error, handleProductClick, isGridView, pageControl]);

    const productsCount = data && data.products && data.products.total_count ? data.products.total_count : 0;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null && !!searchTerm;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} toggleAction={setOpenSidebar} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? <FilterModal filters={filters} /> : null;

    const maybeSidebar = shouldShowFilterButtons ? <FilterSidebar filters={filters} isOpen={isOpenSidebar} /> : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : loading ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortGridView = productsCount ? (
        <div className={classes.viewSwitcher}>
            <ToggleViewButton changeView={isGridView} onPress={setGridView} icon={Grid} />
            <ToggleViewButton changeView={!isGridView} onPress={setGridView} icon={List} />
        </div>
    ) : !productsCount && loading ? (
        <ToggleViewButtonShimmer />
    ) : null;

    const maybeFilterModal = (
        <div ref={sidebarRef} className={classes.topFilter} id="filterModal">
            <Suspense>{shouldRenderSidebarContent ? maybeSidebar : null}</Suspense>
        </div>
    );

    const itemCountHeading =
        data && !loading ? (
            <span className={classes.itemsCountHeading}>
                {formatMessage(
                    {
                        id: 'searchPage.totalPages',
                        defaultMessage: `items`
                    },
                    { totalCount: activeTab.count || productsCount }
                )}
            </span>
        ) : loading ? (
            <Shimmer width={5} />
        ) : null;

    const searchResultsHeading = loading ? (
        <Shimmer width="100%" />
    ) : !data ? null : searchTerm ? (
        <>
            <FormattedMessage
                id={'searchPage.searchTerm'}
                values={{
                    // eslint-disable-next-line react/display-name
                    highlight: chunks => <span className={classes.headingHighlight}>{chunks}</span>,
                    category: searchCategory,
                    term: searchTerm
                }}
                defaultMessage={'Showing results:'}
            />
            {itemCountHeading}
        </>
    ) : (
        <FormattedMessage id={'searchPage.searchTermEmpty'} defaultMessage={'Showing all results:'} />
    );

    const metaLabel = [searchTerm, `${STORE_NAME} Search`].filter(Boolean).join(' - ');
    const searchContent = !isNoProductBlock ? classes.searchContent : classes.searchContentNoProducts;

    const searchToolbarHeading = (
        <div className={classes.heading}>
            {maybeSortGridView}
            <div className={classes.headerButtons}>
                {maybeSortButton}
                {maybeFilterButtons}
                <TabsButton setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>
        </div>
    );

    return (
        <>
            <Breadcrumbs staticPage={PAGE_TITLE} />
            <StoreTitle>{searchResultsHeading}</StoreTitle>
            {!isNoProductBlock && <h1 className={classes.title}>{searchResultsHeading}</h1>}
            <article className={classes.root}>
                <div className={classes.contentWrapper}>
                    <div className={searchContent}>
                        {!isNoProductBlock && (
                            <div className={classes.toolbarSectionWrapper}>
                                <div className={classes.toolbarSection}>
                                    {searchToolbarHeading}
                                    {maybeFilterModal}
                                </div>
                            </div>
                        )}
                        {content}
                        <Suspense fallback={null}>{filtersModal}</Suspense>
                    </div>
                </div>

                <Title>{metaLabel}</Title>
                <Meta name="title" content={metaLabel} />
                <Meta name="description" content={metaLabel} />
                <OgMeta property="og:title" content={metaLabel} />
                <OgMeta property="og:description" content={metaLabel} />
                <OgMeta property="og:type" content="website" />
            </article>
        </>
    );
};

export default SearchPage;
