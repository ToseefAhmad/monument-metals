import { gql } from '@apollo/client';
import { object } from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Delete as DeleteIcon } from '@app/components/MonumentIcons';
import PreorderLabel from '@app/components/PreorderLabel';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './product.module.css';
import Quantity from './quantity';
import { useProduct } from './useProduct';

const IMAGE_SIZE = 100;

const Product = props => {
    const { item } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const {
        errorMessage,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        product,
        isProductUpdating,
        handleLinkClick
    } = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'product.insufficientstock',
                    defaultMessage: errorMessage
                }),
                timeout: false
            });
        }
    }, [addToast, errorMessage, formatMessage]);

    const { currency, image, name, quantity, unitPrice, urlKey, urlSuffix, stockStatus, preorder_note } = product;
    const classes = useStyle(defaultClasses, props.classes);
    const itemClassName = isProductUpdating ? classes.item_disabled : classes.item;
    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix || ''}`), [urlKey, urlSuffix]);
    const productTotalPrice = unitPrice * quantity;
    const stockStatusText =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'productList.outOfStockStatus',
                  defaultMessage: 'Out-of-Stock'
              })
            : '';

    return (
        <li className={classes.root}>
            <div className={itemClassName}>
                <div className={classes.info}>
                    <Link to={itemLink} className={classes.imageContainer} onClick={handleLinkClick}>
                        <Image
                            alt={name}
                            classes={{
                                root: classes.imageRoot,
                                image: classes.image
                            }}
                            width={IMAGE_SIZE}
                            resource={image}
                        />
                    </Link>
                    <div className={classes.nameContainer}>
                        <Link to={itemLink} onClick={handleLinkClick}>
                            <span className={classes.name}>{name}</span>
                        </Link>
                        {stockStatusText && <span className={classes.stockStatus}> ({stockStatusText})</span>}
                    </div>
                    <div className={classes.product_code}>
                        <PreorderLabel stockStatus={stockStatus} preorderNote={preorder_note} />
                    </div>
                </div>
                <div className={classes.details}>
                    <p className={classes.price}>
                        <Price currencyCode={currency} value={unitPrice} />
                    </p>
                    <div className={classes.quantity}>
                        <Quantity itemId={item.id} initialValue={quantity} onChange={handleUpdateItemQuantity} />
                    </div>
                    <div className={classes.product_total}>
                        <span className={classes.total}>Total:</span>{' '}
                        <div className={classes.product_total_price}>
                            <Price currencyCode={currency} value={productTotalPrice} />
                        </div>
                    </div>
                </div>
                <div className={classes.actions}>
                    <button onClick={handleRemoveFromCart}>
                        <DeleteIcon />{' '}
                    </button>
                </div>
            </div>
        </li>
    );
};

Product.propTypes = {
    item: object,
    classes: object
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $itemId }) @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity($cartId: String!, $itemId: ID!, $quantity: Float!) {
        updateCartItems(input: { cart_id: $cartId, cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }] })
            @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
