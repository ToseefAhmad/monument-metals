import { object } from 'prop-types';
import React from 'react';

import Item from './item';
import classes from './itemsReview.module.css';
import ItemsReviewShimmer from './itemsReview.shimmer';
import { useItemsReview } from './useItemsReview';

/**
 * Renders a list of items in an order.
 * @param {Object} data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = ({ data }) => {
    const { items: itemsInCart, isLoading, configurableThumbnailSource } = useItemsReview({
        data
    });

    const items = itemsInCart.map(item => (
        <Item key={item.id} {...item} configurableThumbnailSource={configurableThumbnailSource} />
    ));

    if (isLoading) {
        return <ItemsReviewShimmer />;
    }

    return <div className={classes.root}>{items}</div>;
};

ItemsReview.propTypes = {
    data: object
};

export default ItemsReview;
