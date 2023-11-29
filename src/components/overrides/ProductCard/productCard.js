import { func, number, shape, string } from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './productCard.module.css';

const IMAGE_WIDTH = 110;
const IMAGE_RATIO = 1;

const ProductCard = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { url_key, small_image, name, onNavigate, price, url_suffix, onClick, onKeyDown } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
            onClick && onClick();
        }
    }, [onNavigate, onClick]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [url_key, url_suffix]);

    return (
        <Link onKeyDown={onKeyDown} className={classes.root} to={uri} onClick={handleClick}>
            <div className={classes.imageWrapper}>
                <Image
                    alt={name}
                    classes={{ image: classes.thumbnail, root: classes.image }}
                    resource={small_image}
                    width={IMAGE_WIDTH}
                    ratio={IMAGE_RATIO}
                />
            </div>
            <div className={classes.nameAndPrice}>
                <span className={classes.name}>{name}</span>
                <span className={classes.price}>
                    <span className={classes.textBeforePrice}>
                        <FormattedMessage id="productCard.textBeforePrice" defaultMessage={'As low as: '} />
                    </span>
                    <Price currencyCode={price.regularPrice.amount.currency} value={price.regularPrice.amount.value} />
                </span>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    url_key: string.isRequired,
    url_suffix: string,
    small_image: string.isRequired,
    name: string.isRequired,
    onNavigate: func,
    price: shape({
        regularPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        })
    }).isRequired,
    classes: shape({
        root: string,
        imageWrapper: string,
        image: string,
        imageAndName: string,
        name: string,
        price: string,
        textBeforePrice: string,
        thumbnail: string
    }),
    onClick: func,
    onKeyDown: func
};

export default ProductCard;
