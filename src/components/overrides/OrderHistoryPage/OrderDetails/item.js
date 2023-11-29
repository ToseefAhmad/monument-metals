import { shape, string, number, arrayOf, bool } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PreorderLabel from '@app/components/PreorderLabel';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useOrderHistoryContext } from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        product_sku,
        product_name,
        product_sale_price,
        product_url_key,
        quantity_ordered,
        thumbnail,
        is_preorder,
        preorder_note
    } = props;
    const { currency, value: unitPrice } = product_sale_price;
    const { trackProductClick } = useTracking();

    const orderHistoryState = useOrderHistoryContext();
    const { productURLSuffix } = orderHistoryState;
    const itemLink = `/${product_url_key}${productURLSuffix}`;

    const productTotalPrice = parseFloat(product_sale_price.value) * parseFloat(quantity_ordered);

    const classes = useStyle(defaultClasses, props.classes);

    const thumbnailProps = {
        alt: product_name,
        classes: { root: classes.thumbnail },
        width: 60
    };
    const thumbnailElement = thumbnail ? (
        <Image
            {...thumbnailProps}
            classes={{
                image: classes.image
            }}
            resource={thumbnail.url}
        />
    ) : (
        <PlaceholderImage {...thumbnailProps} />
    );

    const handleLinkClick = useCallback(() => {
        trackProductClick({
            listName: 'Order History Page',
            product: {
                sku: product_sku,
                name: product_name,
                price: unitPrice,
                currency: currency,
                category: ''
            }
        });
    }, [currency, product_name, product_sku, trackProductClick, unitPrice]);

    return (
        <div className={classes.root}>
            <div className={classes.itemsContainer}>
                <Link className={classes.thumbnailContainer} to={itemLink} onClick={handleLinkClick}>
                    {thumbnailElement}
                </Link>
                <Link to={itemLink} onClick={handleLinkClick}>
                    {product_name}
                </Link>
                <PreorderLabel
                    classes={{ root: classes.preorderLabel }}
                    stockStatus={is_preorder ? 'PREORDER' : null}
                    preorderNote={preorder_note}
                />
            </div>
            <div className={classes.price}>
                <span className={classes.itemPriceLabel}>
                    <FormattedMessage id={'orderItem.priceLabel'} defaultMessage={'Price:'} />
                </span>
                <Price classes={{ currency: classes.priceCurrency }} currencyCode={currency} value={unitPrice} />
            </div>
            <div className={classes.quantity}>
                <span className={classes.itemQtyLabel}>
                    <FormattedMessage id={'orderItem.priceLabel'} defaultMessage={'QTY:'} />
                </span>
                {quantity_ordered}
            </div>
            <div className={classes.totalPrice}>
                <span className={classes.itemTotalLabel}>
                    <FormattedMessage id={'orderItem.totalLabel'} defaultMessage={'Total:'} />
                </span>
                <Price
                    classes={{ currency: classes.priceCurrency }}
                    currencyCode={currency}
                    value={productTotalPrice}
                />
            </div>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnailContainer: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        buyAgainButton: string
    }),
    product_sku: string.isRequired,
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    thumbnail: shape({
        url: string
    }),
    is_preorder: bool,
    preorder_note: string
};
