import { string, number, shape } from 'prop-types';
import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import AmProductLabels from '@app/components/ProductLabels';
import { ProductPriceSmall } from '@app/components/TierPrice';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import AddToCartButton from './addToCartButton';
import defaultClasses from './item.module.css';
import GalleryItemShimmer from './item.shimmer';
import { useGalleryItem } from './useGalleryItem';

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;
const IMAGE_RATIO = 1;

const GalleryItem = props => {
    const { handleLinkClick, item, isSupportedProductType, isDesktopScreen } = useGalleryItem(props);

    const { storeConfig } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price_range, price_tiers, small_image, url_key, stock_status, preorder_note } = item;
    const { url: smallImageURL } = small_image;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const addButton =
        isSupportedProductType && isDesktopScreen ? (
            <AddToCartButton item={item} />
        ) : (
            <div className={classes.unavailableContainer}>
                <Info />
                <p>
                    <FormattedMessage
                        id={'galleryItem.unavailableProduct'}
                        defaultMessage={'Currently unavailable for purchase.'}
                    />
                </p>
            </div>
        );

    const deliveryBlock =
        stock_status === 'PREORDER' && preorder_note ? (
            <div className={classes.delivery}>
                <span className={classes.deliveryTime}>{preorder_note}</span>
            </div>
        ) : null;

    const priceValue =
        price_tiers.length > 0
            ? price_tiers[price_tiers.length - 1].final_price.value
            : price_range.maximum_price.final_price.value;

    const productPrice =
        stock_status !== 'OUT_OF_STOCK' ? (
            <div className={classes.priceWrapper}>
                <span className={classes.priceText}>
                    <FormattedMessage id={'galleryItem.priceTextAsLowAs'} defaultMessage={'As low as: '} />
                </span>
                <span className={classes.price}>
                    <Price value={priceValue} currencyCode={price_range.maximum_price.final_price.currency} />
                </span>
            </div>
        ) : null;

    const hoverContainer =
        stock_status !== 'OUT_OF_STOCK' ? (
            <div className={classes.hoverContainer}>
                <ProductPriceSmall
                    tierPrices={price_tiers}
                    mainPrice={price_range.maximum_price}
                    classes={{
                        table: classes.table,
                        tableTitle: classes.tableTitle,
                        tableTitleLeft: classes.tableTitleLeft,
                        tableTitleRight: classes.tableTitleRight,
                        tableQuantity: classes.tableQuantity,
                        tablePrice: classes.tablePrice
                    }}
                />
                {deliveryBlock}
            </div>
        ) : null;

    return (
        <div className={`${classes.root} galleryItem`} aria-live="polite" aria-busy="false">
            <Link
                className={classes.images}
                onClick={handleLinkClick}
                to={{ pathname: productLink, state: { prevPath: location.pathname } }}
            >
                <AmProductLabels mode={'CATEGORY'} itemId={item.id} productWidth={IMAGE_WIDTH} />
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    width={IMAGE_WIDTH}
                    ratio={IMAGE_RATIO}
                    resource={smallImageURL}
                />
            </Link>
            <div className={classes.nameWrapper}>
                <Link
                    className={classes.name}
                    onClick={handleLinkClick}
                    to={{ pathname: productLink, state: { prevPath: location.pathname } }}
                >
                    {name}
                </Link>
            </div>
            {productPrice}
            <div className={classes.actionsContainer}>{addButton}</div>
            {hoverContainer}
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    })
};

export default GalleryItem;
