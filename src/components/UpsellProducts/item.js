import { Form } from 'informed';
import { arrayOf, shape, string, number } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Cart as CartIcon } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import Price from '@app/components/overrides/Price';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './item.module.css';
import { useItem } from './useItem';

const IMAGE_HEIGHT = 80;
const IMAGE_WIDTH = 80;
const IMAGE_RATIO = 1;

const Item = ({ product, storeConfigData }) => {
    const {
        name,
        small_image: { url },
        price_range: {
            maximum_price: {
                final_price: { currency }
            }
        }
    } = product;
    const {
        handleAddToCart,
        isAddProductToCartLoading,
        handleQuantityChange,
        productLink,
        priceValue,
        altText
    } = useItem({
        product,
        storeConfigData
    });

    const { isMobileScreen } = useScreenSize();

    const buttonContent = isMobileScreen ? (
        <FormattedMessage id="global.addToCart" defaultMessage={'Add To Cart'} />
    ) : (
        <Icon src={CartIcon} />
    );

    return (
        <Form className={classes.root} onSubmit={handleAddToCart}>
            <Link to={productLink} className={classes.link}>
                <div className={classes.imageWrapper}>
                    <Image
                        classes={{ root: classes.imageRoot, image: classes.image }}
                        resource={url}
                        alt={altText}
                        height={IMAGE_HEIGHT}
                        width={IMAGE_WIDTH}
                        ratio={IMAGE_RATIO}
                    />
                </div>
                <p className={classes.content}>
                    <span className={classes.name}>{name}</span>{' '}
                    <span className={classes.price}>
                        <Price value={priceValue} currencyCode={currency} />
                    </span>
                </p>
            </Link>
            <div className={classes.actions}>
                <div className={classes.quantity}>
                    <QuantityFields min={1} onChange={handleQuantityChange} />
                </div>
                <div className={classes.button}>
                    <Button type="submit" disabled={isAddProductToCartLoading}>
                        {buttonContent}
                    </Button>
                </div>
            </div>
        </Form>
    );
};

Item.propTypes = {
    product: shape({
        __typename: string,
        id: number,
        uid: string,
        sku: string,
        name: string,
        url_key: string,
        small_image: shape({
            label: string,
            url: string
        }),
        price_range: shape({
            __typename: string,
            maximum_price: shape({
                __typename: string,
                final_price: shape({
                    __typename: string,
                    currency: string,
                    value: number
                })
            })
        }),
        price_tiers: arrayOf(
            shape({
                __typename: string,
                quantity: number,
                final_price: shape({
                    __typename: string,
                    currency: string,
                    value: number
                })
            })
        )
    }),
    storeConfigData: shape({
        storeConfig: shape({
            __typename: string,
            id: number,
            product_url_suffix: string
        })
    })
};

export default Item;
