import classnames from 'classnames';
import { bool, shape, string, func } from 'prop-types';
import React, { useEffect } from 'react';
import { AlertCircle as AlertCircleIcon, X as CloseIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { ShoppingCart as ShoppingCartIcon } from '@app/components/MonumentIcons';
import { useScrollLock, Price, useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Mask from '@magento/venia-ui/lib/components/Mask';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';

import operations from './miniCart.gql';
import defaultClasses from './miniCart.module.css';
import ProductList from './ProductList';
import { useMiniCart } from './useMiniCart';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // When the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        operations
    });

    const {
        closeMiniCart,
        errorMessage,
        handleProceedToCheckout,
        handleRemoveItem,
        handleUpdateItemQuantity,
        loading,
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const quantityClassName = loading ? classes.quantity_loading : classes.quantity;
    const priceClassName = loading ? classes.price_loading : classes.price;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const totalQuantityMessage =
        totalQuantity === 1 ? (
            <FormattedMessage id={'miniCart.totalQuantityItem'} defaultMessage={'item'} values={{ totalQuantity }} />
        ) : (
            <FormattedMessage id={'miniCart.totalQuantityItems'} defaultMessage={'items'} values={{ totalQuantity }} />
        );

    const totalItems = !isCartEmpty ? (
        <div className={quantityClassName}>
            <FormattedMessage id={'miniCart.totalItems'} defaultMessage={'Total items: '} />
            <span className={classes.quantityItems}>{totalQuantityMessage}</span>
        </div>
    ) : null;

    const headerContents = (
        <>
            <div className={classes.headingWrapper}>
                <span className={classes.title}>
                    <FormattedMessage id={'miniCart.myCart'} defaultMessage={'My Cart'} />
                </span>
                <button className={classes.closeButton} onClick={closeMiniCart}>
                    <Icon size={32} src={CloseIcon} />
                </button>
            </div>
            {totalItems}
            <div className={classes.stockStatusMessageContainer}>
                <StockStatusMessage cartItems={productList} />
            </div>
        </>
    );

    const body = isCartEmpty ? (
        <div className={classes.bodyEmpty}>
            <div className={classes.emptyCart}>
                <span className={classes.emptyCartIcon}>
                    <Icon src={ShoppingCartIcon} />
                </span>
                <span className={classes.title}>
                    <FormattedMessage id={'miniCart.emptyCart'} defaultMessage={'Your cart is empty'} />
                </span>
                <p>
                    <FormattedMessage
                        id={'miniCart.emptyCartMessage'}
                        defaultMessage={
                            'Looks like you haven’t added any items to the cart yet. Start shopping to fill it in.'
                        }
                    />
                </p>
            </div>
        </div>
    ) : (
        <div className={classes.body}>
            <ProductList
                items={productList}
                loading={loading}
                handleRemoveItem={handleRemoveItem}
                handleUpdateItemQuantity={handleUpdateItemQuantity}
                closeMiniCart={closeMiniCart}
                configurableThumbnailSource={configurableThumbnailSource}
                storeUrlSuffix={storeUrlSuffix}
            />
        </div>
    );

    const footerContents = isCartEmpty ? (
        <Link to="/" onClick={closeMiniCart} className={classes.shoppingButton}>
            <FormattedMessage id={'miniCart.startShopping'} defaultMessage={'Start Shopping'} />
        </Link>
    ) : (
        <>
            <span className={priceClassName}>
                <span className={classes.priceText}>
                    <FormattedMessage id={'miniCart.subtotalPrice'} defaultMessage={'Subtotal price: '} />
                </span>
                <span className={classes.priceTotal}>
                    <Price currencyCode={subTotal.currency} value={subTotal.value} />
                </span>
            </span>
            <Button onClick={handleProceedToCheckout} priority="normal" disabled={loading || isCartEmpty}>
                <FormattedMessage id={'miniCart.proceedToCheckout'} defaultMessage={'Proceed to Checkout'} />
            </Button>
        </>
    );

    return (
        <>
            <aside className={rootClass}>
                <div ref={ref} className={contentsClass}>
                    <div className={classnames({ [classes.headerEmpty]: isCartEmpty, [classes.header]: !isCartEmpty })}>
                        {headerContents}
                    </div>
                    {body}
                    <div className={classes.footer}>{footerContents}</div>
                </div>
            </aside>
            <Mask isActive={isOpen} dismiss={closeMiniCart} />
        </>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        editCartButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool,
    setIsOpen: func
};
