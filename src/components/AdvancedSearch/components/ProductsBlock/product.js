import { func, object } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useAmXsearchContext } from '../../context';
import { useProduct } from '../../talons/useProduct';
import Rating from '../Rating';

import { Price } from '@magento/peregrine';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Button from '@magento/venia-ui/lib/components/Button';

import classes from './productsBlock.module.css';

const ProductsBlock = props => {
    const { product, closeSearchBar } = props;
    const { storeConfig } = useAmXsearchContext();

    const { handleAddToCart, price, currency } = useProduct({
        product
    });

    const {
        amasty_xsearch_product_add_to_cart,
        amasty_xsearch_product_reviews,
        amasty_xsearch_product_name_length
    } = storeConfig;

    const { url_key, url_suffix, rating_summary } = product;
    const url = resourceUrl(`/${url_key}${url_suffix}`);
    const ratingPercent = parseInt(rating_summary, 10);
    const ratingStarsQty = ratingPercent / 20; // 20 - 1 star coefficient

    const productName = amasty_xsearch_product_name_length
        ? product.name.slice(0, amasty_xsearch_product_name_length)
        : product.name;

    const productPrice = product.is_salable
        ? !!price && (
              <div className={classes.priceWrapper}>
                  <span className={classes.priceText}>
                      <FormattedMessage id={'galleryItem.priceText'} defaultMessage={'As low as: '} />
                  </span>
                  <p className={classes.price}>
                      <Price currencyCode={currency} value={price} />
                  </p>
              </div>
          )
        : null;

    return (
        <Link onClick={closeSearchBar} className={classes.itemLink} to={url}>
            <li className={classes.item}>
                <div className={classes.imageContainer}>
                    <img className={classes.image} src={`/${product.image.url}`} alt={product.name} />
                </div>
                <div className={classes.description}>
                    <div className={classes.title} to={url}>
                        {productName}
                    </div>
                    {!!product.rating_summary && amasty_xsearch_product_reviews && (
                        <Rating
                            className={classes.rating}
                            count={product.reviews_count}
                            percent={ratingPercent}
                            value={ratingStarsQty}
                        />
                    )}
                    {productPrice}
                    {amasty_xsearch_product_add_to_cart && product.is_salable && (
                        <Button className={classes.addToCart} onClick={handleAddToCart}>
                            {'Add To Cart'}
                        </Button>
                    )}
                </div>
            </li>
        </Link>
    );
};

export default ProductsBlock;

ProductsBlock.propTypes = {
    product: object,
    closeSearchBar: func.isRequired
};
