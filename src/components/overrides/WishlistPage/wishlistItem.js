import PropTypes, { array } from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Trash2 } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Icon from '../Icon';
import Price from '../Price';

import { useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './wishlistItem.module.css';

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;
const IMAGE_RATIO = 1;

const WishlistItem = props => {
    const { item } = props;

    const { configurable_options: configurableOptions = [], product } = item;
    const {
        name,
        url_key: productLink,
        url_suffix: suffix,
        price_range: priceRange,
        stock_status: stockStatus
    } = product;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem(props);
    const {
        addToCartButtonProps,
        handleRemoveProductFromWishlist,
        hasError,
        isRemovalInProgress,
        isSupportedProductType
    } = talonProps;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'wishlistItem.addToCartError',
                    defaultMessage: 'Something went wrong. Please refresh and try again.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasError]);

    // const classes = useStyle(defaultClasses, props.classes);

    const optionElements = useMemo(() => {
        return configurableOptions.map(option => {
            const { id, option_label: optionLabel, value_label: valueLabel } = option;

            const optionString = `${optionLabel} : ${valueLabel}`;

            return (
                <span className={classes.option} key={id}>
                    {optionString}
                </span>
            );
        });
    }, [configurableOptions]);

    const imageProps = {
        classes: {
            image: stockStatus === 'OUT_OF_STOCK' ? classes.image_disabled : classes.image
        },
        ...talonProps.imageProps
    };

    const removeProductAriaLabel = formatMessage({
        id: 'wishlistItem.removeAriaLabel',
        defaultMessage: 'Remove Product from wishlist'
    });

    const rootClass = isRemovalInProgress ? classes.root_disabled : classes.root;

    const addToCart = isSupportedProductType ? (
        <button className={classes.addToCart} {...addToCartButtonProps}>
            {formatMessage({
                id: 'wishlistItem.addToCart',
                defaultMessage: 'Add to Cart'
            })}
        </button>
    ) : null;

    if (!item) {
        return null;
    }

    return (
        <div className={rootClass}>
            <Link
                className={classes.images}
                to={{ pathname: productLink + suffix, state: { prevPath: location.pathname } }}
            >
                <Image
                    {...imageProps}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    width={IMAGE_WIDTH}
                    ratio={IMAGE_RATIO}
                />
            </Link>
            <div className={classes.nameWrapper}>
                <Link
                    className={classes.name}
                    to={{ pathname: productLink + suffix, state: { prevPath: location.pathname } }}
                >
                    {name}
                </Link>
            </div>
            <div className={classes.priceWrapper}>
                <div className={classes.price}>
                    <Price currencyCode={currency} value={unitPrice} />
                </div>
            </div>
            {optionElements}
            <div className={classes.actionsContainer}>
                {addToCart}
                <button
                    className={classes.deleteItem}
                    onClick={handleRemoveProductFromWishlist}
                    aria-label={removeProductAriaLabel}
                >
                    <Icon size={16} src={Trash2} />
                </button>
            </div>
        </div>
    );
};

WishlistItem.propTypes = {
    item: PropTypes.shape({
        configurable_options: array,
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            url_key: PropTypes.string.isRequired,
            url_suffix: PropTypes.string,
            price_range: PropTypes.object,
            stock_status: PropTypes.string
        })
    })
};

export default WishlistItem;
