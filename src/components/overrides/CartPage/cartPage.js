import React, { useEffect, useCallback } from 'react';
import { Check } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { useHistory, Link } from 'react-router-dom';

import CartPayment from '@app/components/CartPayment';
import { ShoppingCart as ShoppingCartIcon } from '@app/components/MonumentIcons';
import BreadCrumbs from '@app/components/overrides/Breadcrumbs';
import Button from '@app/components/overrides/Button';
import { StoreTitle } from '@app/components/overrides/Head';
import { useToasts } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';

import classes from './cartPage.module.css';
import PriceAdjustments from './PriceAdjustments/priceAdjustments';
import PriceSummary from './PriceSummary/priceSummary';
import ProductListing from './ProductListing/productListing';
import { useCartPage } from './useCartPage';

const CheckIcon = <Icon size={20} src={Check} />;

const CartPage = () => {
    const {
        cartItems,
        hasOutOfStockItem,
        hasItemErrors,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
        isPaymentSelected,
        setIsPaymentSelected,
        refreshPayment,
        setRefreshPayment,
        isSignedIn
    } = useCartPage();
    const { isCheckout, isLoading } = usePriceSummary();
    const [toastState, { addToast }] = useToasts();
    const history = useHistory();

    const isAnyToasts = toastState?.toasts?.size;

    const handleProceedToCheckout = useCallback(() => {
        if (isSignedIn) {
            history.push('/checkout');
        } else {
            history.push('/cart-login');
        }
    }, [history, isSignedIn]);

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems && (
        <ProductListing
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            setIsCartUpdating={setIsCartUpdating}
            fetchCartDetails={fetchCartDetails}
        />
    );

    const priceSummary = hasItems ? <PriceSummary isUpdating={isCartUpdating} /> : null;

    const headerLabels = ['Item name', 'Product price', 'QTY', 'Total', 'Actions'];

    const productHeader = (
        <div className={classes.items_header}>
            {headerLabels.map(label => (
                <p key={label} className={classes.bodyTextSmall}>
                    {label}
                </p>
            ))}
        </div>
    );

    const isPriceUpdating = isCartUpdating || isLoading;

    const proceedToCheckoutButtonMobile =
        !isCheckout && hasItems ? (
            <div
                className={
                    isAnyToasts
                        ? classes.checkoutButton_container_MobileSpacer
                        : classes.checkoutButton_container_Mobile
                }
            >
                <Button
                    disabled={!hasItems || isPriceUpdating || !isPaymentSelected || hasOutOfStockItem || hasItemErrors}
                    priority={'normal'}
                    onClick={handleProceedToCheckout}
                >
                    <FormattedMessage id={'priceSummary.checkoutButton'} defaultMessage={'Proceed to Checkout'} />
                </Button>
            </div>
        ) : (
            <div
                className={
                    isAnyToasts
                        ? classes.checkoutButton_container_MobileSpacer
                        : classes.checkoutButton_container_Mobile
                }
            >
                <Link to="/" className={classes.shoppingButtonMobile}>
                    <FormattedMessage id={'cartPage.startShopping'} defaultMessage={'Start Shopping'} />
                </Link>
            </div>
        );

    const proceedToCheckoutButton =
        !isCheckout && hasItems ? (
            <div className={classes.checkoutButton_container}>
                <Button
                    disabled={!hasItems || isPriceUpdating || !isPaymentSelected || hasOutOfStockItem || hasItemErrors}
                    priority={'normal'}
                    onClick={handleProceedToCheckout}
                >
                    <FormattedMessage id={'priceSummary.checkoutButton'} defaultMessage={'Proceed to Checkout'} />
                </Button>
            </div>
        ) : (
            <div className={classes.checkoutButton_container}>
                <Link to="/" className={classes.shoppingButton} type="button">
                    <FormattedMessage id={'cartPage.startShopping'} defaultMessage={'Start Shopping'} />
                </Link>
            </div>
        );

    return (
        <>
            <StoreTitle>Cart</StoreTitle>
            <div className={classes.root}>
                <BreadCrumbs staticPage={'Cart'} />
                <div className={classes.heading_container}>
                    <h1>
                        <FormattedMessage id={'cartPage.heading'} defaultMessage={'Cart'} />
                    </h1>
                </div>
                <div className={classes.body}>
                    {hasItems ? (
                        <div className={classes.payment_container}>
                            <CartPayment
                                fetchCartDetails={fetchCartDetails}
                                setPaymentSelected={setIsPaymentSelected}
                                refreshPayment={refreshPayment}
                                setRefreshPayment={setRefreshPayment}
                            />
                        </div>
                    ) : (
                        <h3 className={classes.noItemsHeading}>
                            <FormattedMessage
                                id={'cartPage.noItems'}
                                defaultMessage={'There are no items in your cart.'}
                            />
                        </h3>
                    )}

                    <div className={classes.items_container}>
                        {hasItems && (
                            <>
                                <div className={classes.stockStatusMessageContainer}>
                                    <StockStatusMessage cartItems={cartItems} />
                                </div>
                                <h4 className={classes.productlisting_label}>Verify products</h4>
                                {productHeader}
                            </>
                        )}

                        {productListing}
                    </div>
                    <div className={classes.summary_container}>
                        <div className={classes.stickyContainer}>
                            <div className={classes.price_adjustments_container}>
                                <div className={hasItems ? classes.summary_title : classes.summary_title_empty}>
                                    <h4>Order summary</h4>
                                </div>

                                {hasItems ? (
                                    <PriceAdjustments
                                        fetchCartDetails={fetchCartDetails}
                                        setIsCartUpdating={setIsCartUpdating}
                                    >
                                        <div className={classes.summary_contents}>{priceSummary}</div>
                                    </PriceAdjustments>
                                ) : (
                                    <div className={classes.bodyEmpty}>
                                        <div className={classes.emptyCart}>
                                            <span className={classes.emptyCartIcon}>
                                                <Icon src={ShoppingCartIcon} />
                                            </span>
                                            <span className={classes.title}>
                                                <FormattedMessage
                                                    id={'cartPage.emptyCart'}
                                                    defaultMessage={'Your cart is empty'}
                                                />
                                            </span>
                                            <p>
                                                <FormattedMessage
                                                    id={'cartPage.emptyCartMessage'}
                                                    defaultMessage={
                                                        'Looks like you haven’t added any items to the cart yet. Start shopping to fill it in.'
                                                    }
                                                />
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {proceedToCheckoutButton}
                        </div>
                    </div>
                    {proceedToCheckoutButtonMobile}
                </div>
            </div>
        </>
    );
};

export default CartPage;
