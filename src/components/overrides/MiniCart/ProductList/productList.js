import { bool, string, func, arrayOf, shape, number, oneOf } from 'prop-types';
import React, { useMemo } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Item from './item';
import defaultClasses from './productList.module.css';

const ProductList = props => {
    const {
        items,
        loading,
        handleRemoveItem,
        handleUpdateItemQuantity,
        classes: propClasses,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const cartItems = useMemo(() => {
        if (items) {
            return items.map(item => (
                <Item
                    key={item.id}
                    {...item}
                    loading={loading}
                    closeMiniCart={closeMiniCart}
                    handleRemoveItem={handleRemoveItem}
                    handleUpdateItemQuantity={handleUpdateItemQuantity}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            ));
        }
    }, [
        items,
        loading,
        closeMiniCart,
        handleRemoveItem,
        handleUpdateItemQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    ]);

    return <div className={classes.root}>{cartItems}</div>;
};

export default ProductList;

ProductList.propTypes = {
    classes: shape({ root: string }),
    loading: bool,
    items: arrayOf(
        shape({
            product: shape({
                name: string,
                thumbnail: shape({
                    url: string
                })
            }),
            id: string,
            quantity: number,
            configurable_options: arrayOf(
                shape({
                    label: string,
                    value: string
                })
            ),
            prices: shape({
                price: shape({
                    value: number,
                    currency: string
                })
            }),
            configured_variant: shape({
                thumbnail: shape({
                    url: string
                })
            })
        })
    ),
    configurableThumbnailSource: oneOf(['parent', 'itself']),
    handleRemoveItem: func,
    handleUpdateItemQuantity: func,
    closeMiniCart: func,
    storeUrlSuffix: string
};
