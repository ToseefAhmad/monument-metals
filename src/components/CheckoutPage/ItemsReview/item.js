import { shape, number, string, arrayOf } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import PreorderLabel from '@app/components/PreorderLabel';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';

import classes from './item.module.css';

const Item = ({ product, prices, quantity, configurable_options, configurableThumbnailSource }) => {
    const configured_variant = configuredVariant(configurable_options, product);

    const priceData = prices.row_total;
    const currency = priceData.currency;
    const totalPrice = priceData.value;

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <Image
                    alt={product.name}
                    classes={{
                        root: classes.imageRoot,
                        image: classes.image
                    }}
                    width={40}
                    resource={
                        configurableThumbnailSource === 'itself' && configured_variant
                            ? configured_variant.thumbnail.url
                            : product.thumbnail.url
                    }
                />
            </div>
            <div className={classes.details}>
                <p className={classes.name}>{product.name}</p>
                <ProductOptions
                    options={configurable_options}
                    classes={{
                        options: classes.options
                    }}
                />
                <div className={classes.info}>
                    <span className={classes.price}>
                        <Price currencyCode={currency} value={totalPrice} />
                    </span>
                    <span className={classes.quantity}>
                        <FormattedMessage id={'checkoutPage.qty'} defaultMessage={'Qty:'} values={{ quantity }} />
                    </span>
                </div>
                <PreorderLabel stockStatus={product.stock_status} />
            </div>
        </div>
    );
};

Item.propTypes = {
    product: shape({
        id: number,
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    prices: shape({
        row_total: shape({
            currency: string,
            value: number
        })
    }),
    configurable_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ),
    quantity: number,
    configurableThumbnailSource: string
};

export default Item;
