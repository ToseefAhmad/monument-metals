import { bool, shape, string, int } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useWishlist } from './useWishlist';
import defaultClasses from './wishlist.module.css';
import WishlistItems from './wishlistItems';

const PAGE_SIZE = 20;

/**
 * A single wishlist container.
 *
 * @param {Object} props.data the data for this wishlist
 * @param {boolean} props.shouldRenderVisibilityToggle whether or not to render the visiblity toggle
 * @param {boolean} props.isCollapsed whether or not is the wishlist unfolded
 */
const Wishlist = props => {
    const { data, isCollapsed } = props;
    const { id, items_count: itemsCount } = data;

    const talonProps = useWishlist({ id, itemsCount, isCollapsed });
    const { isOpen, items, isLoading, isFetchingMore, handleLoadMore } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const contentClass = isOpen ? classes.content : classes.content_hidden;

    if (isLoading && items.length === 0 && !itemsCount) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'wishlist.loadingText'} defaultMessage={'Loading wishlist Items'} />
            </LoadingIndicator>
        );
    }
    const loadMoreButton =
        !isLoading && (items && items.length < itemsCount) ? (
            <div className={classes.loadMoreWrapper}>
                <Button className={classes.loadMore} disabled={isFetchingMore} onClick={handleLoadMore}>
                    <FormattedMessage id={'wishlist.loadMore'} defaultMessage={'Load more'} />
                </Button>
            </div>
        ) : null;

    const contentMessageElement = itemsCount ? (
        <Fragment>
            <WishlistItems items={items} wishlistId={id} isLoading={isLoading} />
        </Fragment>
    ) : (
        <p className={classes.emptyListText}>
            <FormattedMessage
                id={'wishlist.emptyListText'}
                defaultMessage={'There are currently no items in this list'}
            />
        </p>
    );

    return (
        <div className={classes.root}>
            <div className={contentClass}>{contentMessageElement}</div>
            {itemsCount > PAGE_SIZE ? loadMoreButton : null}
        </div>
    );
};

Wishlist.propTypes = {
    classes: shape({
        root: string,
        header: string,
        content: string,
        content_hidden: string,
        emptyListText: string,
        name: string,
        nameContainer: string,
        visibilityToggle: string,
        visibilityToggle_hidden: string,
        visibility: string,
        buttonsContainer: string,
        loadMore: string
    }),
    shouldRenderVisibilityToggle: bool,
    isCollapsed: bool,
    data: shape({
        id: int,
        items_count: int,
        name: string,
        visibility: string
    })
};

Wishlist.defaultProps = {
    data: {
        items_count: 0,
        items_v2: []
    }
};

export default Wishlist;
