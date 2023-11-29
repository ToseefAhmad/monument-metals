import classnames from 'classnames';
import { string, shape, array, bool, func } from 'prop-types';
import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { AmProductLabelProvider } from '@app/components/ProductLabels';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './gallery.module.css';
import GalleryItem from './item';
import GalleryItemShimmer from './item.shimmer';
import GalleryListItem from './listItem';
import { useGallery } from './useGallery';

/**
 * A threshold value defining when InfiniteScroll will call next. Default value is 0.8.
 * It means the next will be called when user comes below 80% of the total height.
 * If you pass threshold in pixels (scrollThreshold="200px"), next will be called once you scroll at least (100% - scrollThreshold) pixels down.
 */
const INFINITE_SCROLL_TRESHOLD = 0.72;

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 */
const Gallery = ({
    classes: propClasses,
    items,
    isGridView,
    loadPrevItems,
    loadMoreItems,
    isLoadPrev,
    isLoadMore,
    isLoadingPrev,
    isLoadingMore,
    onProductClick
}) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { storeConfig, handleLoadPrev, handleLoadMore } = useGallery({ loadPrevItems, loadMoreItems });

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }

                return isGridView ? (
                    <GalleryItem onLinkClick={onProductClick} key={item.id} item={item} storeConfig={storeConfig} />
                ) : (
                    <GalleryListItem onLinkClick={onProductClick} key={item.id} item={item} storeConfig={storeConfig} />
                );
            }),
        [isGridView, items, onProductClick, storeConfig]
    );

    const maybeLoadPrevButton =
        isLoadPrev || isLoadingPrev ? (
            <div className={classes.buttonContainerLoadPrev}>
                <Button onClick={handleLoadPrev} disabled={isLoadingPrev}>
                    {isLoadingPrev ? (
                        <FormattedMessage
                            id="gallery.loadingPreviousProducts"
                            defaultMessage="Loading Previous Products..."
                        />
                    ) : (
                        <FormattedMessage id="gallery.loadPreviousProducts" defaultMessage="Load Previous Products" />
                    )}
                </Button>
            </div>
        ) : null;

    const maybeLoadMoreButton =
        isLoadMore || isLoadingMore ? (
            <div className={classes.buttonContainerLoadMore}>
                <Button onClick={handleLoadMore} disabled={isLoadingMore}>
                    {isLoadingMore ? (
                        <FormattedMessage id="gallery.loadingMoreProducts" defaultMessage="Loading More Products..." />
                    ) : (
                        <FormattedMessage id="gallery.loadMoreProducts" defaultMessage="Load More Products" />
                    )}
                </Button>
            </div>
        ) : null;

    return (
        <AmProductLabelProvider products={items} mode={'CATEGORY'}>
            <div
                className={classnames({
                    [classes.rootList]: !isGridView,
                    [classes.root]: isGridView
                })}
                aria-live="polite"
                aria-busy="false"
            >
                {maybeLoadPrevButton}
                <div className={classes.content}>
                    <InfiniteScroll
                        className={classnames({
                            [classes.infiniteScrollList]: !isGridView,
                            [classes.infiniteScrollGrid]: isGridView
                        })}
                        dataLength={items.length}
                        next={handleLoadMore}
                        hasMore={isLoadMore}
                        scrollThreshold={INFINITE_SCROLL_TRESHOLD}
                    >
                        {galleryItems}
                    </InfiniteScroll>
                </div>
                {maybeLoadMoreButton}
            </div>
        </AmProductLabelProvider>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired,
    isGridView: bool,
    loadPrevItems: func,
    loadMoreItems: func,
    isLoadPrev: bool,
    isLoadMore: bool,
    isLoadingPrev: bool,
    isLoadingMore: bool,
    onProductClick: func.isRequired
};

export default Gallery;
