import { bool, string, number, shape, func, arrayOf, oneOf } from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Delete as DeleteIcon } from '@app/components/MonumentIcons';
import PreorderLabel from '@app/components/PreorderLabel';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Quantity from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './item.module.css';
import { useItem } from './useItem';

const Item = props => {
    const {
        classes: propClasses,
        loading,
        product,
        id,
        quantity,
        uid,
        configurable_options,
        handleRemoveItem,
        handleUpdateItemQuantity,
        prices,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const itemLink = useMemo(() => resourceUrl(`/${product.url_key}${storeUrlSuffix || ''}`), [
        product.url_key,
        storeUrlSuffix
    ]);
    const stockStatusText =
        product.stock_status === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'productList.outOfStockStatus',
                  defaultMessage: 'Out-of-Stock'
              })
            : '';

    const { isLoading, removeItem, updateItemQuantity, handleLinkClick } = useItem({
        loading,
        uid,
        product,
        prices,
        handleRemoveItem,
        handleUpdateItemQuantity,
        closeMiniCart
    });

    const rootClass = isLoading ? classes.root_disabled : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    return (
        <div className={rootClass}>
            <Link className={classes.thumbnailContainer} to={itemLink} onClick={handleLinkClick}>
                <Image
                    alt={product.name}
                    classes={{
                        root: classes.thumbnail,
                        image: classes.image
                    }}
                    width={60}
                    resource={
                        configurableThumbnailSource === 'itself' && configured_variant
                            ? configured_variant.thumbnail.url
                            : product.thumbnail.url
                    }
                />
            </Link>
            <div className={classes.content}>
                <div>
                    <Link className={classes.name} to={itemLink} onClick={handleLinkClick}>
                        {product.name}
                    </Link>
                    {stockStatusText && <span className={classes.stockStatus}> ({stockStatusText})</span>}
                </div>
                <div className={classes.contentItems}>
                    <div className={classes.quantity}>
                        <Quantity
                            itemId={id}
                            initialValue={quantity}
                            onChange={updateItemQuantity}
                            disabled={isLoading}
                        />
                    </div>
                    <span className={classes.price}>
                        <Price currencyCode={prices.price.currency} value={prices.price.value} />
                    </span>
                    <button onClick={removeItem} type="button" className={classes.deleteButton} disabled={isLoading}>
                        <Icon src={DeleteIcon} />
                    </button>
                </div>
                <PreorderLabel stockStatus={product.stock_status} />
            </div>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    loading: bool,
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    uid: string,
    quantity: number,
    storeUrlSuffix: string,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    handleUpdateItemQuantity: func,
    closeMiniCart: func,
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
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself'])
};
