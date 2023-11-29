import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';

import { useWishlistItems } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItems';
import AddToCartDialog from '@magento/venia-ui/lib/components/AddToCartDialog';

import WishlistItem from './wishlistItem';
import classes from './wishlistItems.module.css';

const WishlistItems = props => {
    const { items, wishlistId, isLoading } = props;

    const talonProps = useWishlistItems();
    const { activeAddToCartItem, handleCloseAddToCartDialog, handleOpenAddToCartDialog } = talonProps;

    const itemElements = useMemo(() => {
        return items.map(item => {
            return (
                <WishlistItem
                    key={item.id}
                    item={item}
                    isLoading={isLoading}
                    onOpenAddToCartDialog={handleOpenAddToCartDialog}
                    wishlistId={wishlistId}
                />
            );
        });
    }, [handleOpenAddToCartDialog, isLoading, items, wishlistId]);

    return (
        <Fragment>
            <div className={classes.root}>{itemElements}</div>
            <AddToCartDialog item={activeAddToCartItem} onClose={handleCloseAddToCartDialog} />
        </Fragment>
    );
};

WishlistItems.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            product: PropTypes.object
        })
    ),
    wishlistId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired
};
export default WishlistItems;
