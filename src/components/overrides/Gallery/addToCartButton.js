import classnames from 'classnames';
import { string, number, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { NotifyStockButton } from '@app/components/ProductAlerts';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Quantity from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';

import defaultClasses from './addToCartButton.module.css';

const AddToCartButton = props => {
    const talonProps = useAddToCartButton({
        item: props.item
    });
    const { handleAddToCart, isDisabled, isInStock, isPreorder, changeQtyWithLoading } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);
    // Create 'formId' to submit form outside component
    const formId = `${props.item.sku}_${Math.random()}`;

    const buttonInStock = (
        <>
            <div className={classes.qty}>
                <Quantity
                    initialValue={1}
                    min={1}
                    onChange={changeQtyWithLoading}
                    handleAddToCart={handleAddToCart}
                    formId={formId}
                />
            </div>
            <div className={classes.button}>
                <Button
                    aria-label={formatMessage({
                        id: 'addToCartButton.addItemToCartAriaLabel',
                        defaultMessage: 'Add to Cart'
                    })}
                    disabled={isDisabled}
                    priority="normal"
                    type="submit"
                    form={formId}
                >
                    <span className={classes.text}>
                        <FormattedMessage id="addToCartButton.addItemToCart" defaultMessage="ADD TO CART" />
                    </span>
                </Button>
            </div>
        </>
    );

    const buttonPreorder = (
        <>
            <div className={classes.qty}>
                <Quantity
                    initialValue={1}
                    min={1}
                    onChange={changeQtyWithLoading}
                    handleAddToCart={handleAddToCart}
                    formId={formId}
                />
            </div>
            <div className={classes.button}>
                <Button
                    aria-label={formatMessage({
                        id: 'addToCartButton.preorderToCartAriaLabel',
                        defaultMessage: 'Preorder'
                    })}
                    disabled={isDisabled}
                    priority="normal"
                    type="submit"
                    form={formId}
                >
                    <span className={classes.text}>
                        <FormattedMessage id="addToCartButton.preorderItemToCart" defaultMessage="PREORDER" />
                    </span>
                </Button>
            </div>
        </>
    );

    const buttonOutOfStock = (
        <div className={classnames(classes.button, classes.buttonOutOfStock)}>
            <NotifyStockButton sku={props.item.sku} />
        </div>
    );

    return isPreorder ? buttonPreorder : isInStock ? buttonInStock : buttonOutOfStock;
};

export default AddToCartButton;

AddToCartButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string
        }),
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number,
                    currency: string
                })
            })
        })
    })
};
