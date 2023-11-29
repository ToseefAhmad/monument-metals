import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, Link } from 'react-router-dom';

import MaskedFullPageLoadingIndicator from '@app/components/MaskedFullPageLoadingIndicator';
import { ArrowRight as ArrowRightIcon } from '@app/components/MonumentIcons';
import PayPalButton from '@app/components/OnlinePayments/PayPal/payPalButton';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor';

import BillingAddress from './BillingAddress';
import classes from './checkoutPage.module.css';
import OrderConfirmationPage from './OrderConfirmationPage';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import ShippingInformation from './ShippingInformation';
import ShippingMethod from './ShippingMethod';
import TermsAndConditions from './TermsAndConditions';
import { useCheckoutPage } from './useCheckoutPage';

const CheckoutPage = () => {
    const {
        activePaymentMethod,
        hasOutOfStockItem,
        error,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        checkoutDataLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setIsUpdating,
        setShippingInformationDone,
        setBillingAddressDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        setTermsAndConditionsDone,
        resetTermsAndConditionsDone,
        onTermsAndConditionsError,
        resetReviewOrder,
        isReviewOrder,
        isShippingInformationDone,
        shippingInformationRef,
        billingAddressRef,
        paymentInformationRef,
        termsAndConditionsRef,
        onShippingInformationError,
        scrollBillingAddressIntoView,
        scrollPaymentInformationIntoView,
        resetBillingAddressDone,
        isStepsDone,
        isPaymentLoading,
        isPaymentReady,
        resetShippingInformationDone,
        isAvailableShippingMethods,
        preloadedCustomerAddressesLoading,
        preloadedCustomerAddresses,
        isOrderConfirmationPage,
        isAfterPlacingOrder
    } = useCheckoutPage();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const history = useHistory();

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage: 'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: ToastType.ERROR,
                message,
                timeout: false
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    let checkoutContent;
    if (isOrderConfirmationPage) {
        return <OrderConfirmationPage data={orderDetailsData} orderNumber={orderNumber} />;
    } else if (checkoutDataLoading || preloadedCustomerAddressesLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty || hasOutOfStockItem) {
        history.push('/cart');
    } else {
        const placeOrderButton =
            activePaymentMethod === 'paypal_express' ? (
                <PayPalButton
                    handlePlaceOrder={handlePlaceOrder}
                    disabled={
                        isUpdating ||
                        placeOrderLoading ||
                        orderDetailsLoading ||
                        !isStepsDone ||
                        !isAvailableShippingMethods
                    }
                />
            ) : (
                <div className={classes.buttonContainer}>
                    <Button
                        onClick={handlePlaceOrder}
                        disabled={
                            isUpdating ||
                            !isPaymentReady ||
                            placeOrderLoading ||
                            orderDetailsLoading ||
                            !isAvailableShippingMethods ||
                            isAfterPlacingOrder
                        }
                    >
                        <FormattedMessage id={'checkoutPage.placeOrder'} defaultMessage={'Place Order'} />
                    </Button>
                </div>
            );

        checkoutContent = (
            <div className={classes.checkoutContent}>
                <section className={classes.headingSection}>
                    <h1 className={classes.heading}>
                        <FormattedMessage id={'checkoutPage.checkout'} defaultMessage={'Checkout'} />
                    </h1>
                </section>
                <section className={classes.shippingInformationSection}>
                    <ScrollAnchor ref={shippingInformationRef}>
                        <div className={classes.shippingAddressContent}>
                            <div className={classes.title}>
                                <h4>
                                    <FormattedMessage
                                        id={'checkoutPage.shippingAddress'}
                                        defaultMessage={'Shipping address'}
                                    />
                                </h4>
                            </div>
                            <ShippingInformation
                                onSuccess={setShippingInformationDone}
                                resetSuccess={resetShippingInformationDone}
                                shouldSubmit={isReviewOrder}
                                resetShouldSubmit={resetReviewOrder}
                                onError={onShippingInformationError}
                                preloadedCustomerAddresses={preloadedCustomerAddresses}
                            />
                        </div>
                    </ScrollAnchor>
                    <ScrollAnchor ref={billingAddressRef}>
                        <BillingAddress
                            resetShouldSubmit={resetReviewOrder}
                            resetBillingAddressDone={resetBillingAddressDone}
                            shouldSubmit={isReviewOrder}
                            isShippingInformationDone={isShippingInformationDone}
                            onBillingAddressChangedError={scrollBillingAddressIntoView}
                            onBillingAddressChangedSuccess={setBillingAddressDone}
                        />
                    </ScrollAnchor>
                </section>
                <section className={classes.shippingMethodSection}>
                    <div className={classes.title}>
                        <h4>
                            <FormattedMessage id={'checkoutPage.shippingMethod'} defaultMessage={'Shipping method'} />
                        </h4>
                    </div>
                    <ShippingMethod
                        pageIsUpdating={isUpdating}
                        onSave={setShippingMethodDone}
                        setPageIsUpdating={setIsUpdating}
                        shouldSubmit={isShippingInformationDone}
                    />
                </section>
                <section className={classes.paymentInformationSection}>
                    <div className={classes.title}>
                        <h4>
                            <FormattedMessage id={'checkoutPage.paymentMethod'} defaultMessage={'Payment method'} />
                        </h4>
                        <Link className={classes.selectDifferentMethod} to="/cart">
                            <FormattedMessage
                                id="paymentsMethods.selectDifferent"
                                defaultMessage="Select different payment method"
                            />
                            <Icon src={ArrowRightIcon} />
                        </Link>
                    </div>
                    <ScrollAnchor ref={paymentInformationRef}>
                        <PaymentInformation
                            onSave={setPaymentInformationDone}
                            checkoutError={error}
                            resetShouldSubmit={resetReviewOrder}
                            shouldSubmit={isReviewOrder && isShippingInformationDone}
                            onError={scrollPaymentInformationIntoView}
                        />
                    </ScrollAnchor>
                </section>
                <section className={classes.summarySection}>
                    <div className={classes.summaryContent}>
                        <OrderSummary isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
                        <div className={classes.placeOrderBar}>
                            <ScrollAnchor ref={termsAndConditionsRef}>
                                <div className={classes.termsAndConditionsWrapper}>
                                    <TermsAndConditions
                                        onSuccess={setTermsAndConditionsDone}
                                        resetSuccess={resetTermsAndConditionsDone}
                                        onError={onTermsAndConditionsError}
                                        shouldSubmit={isReviewOrder}
                                        resetShouldSubmit={resetReviewOrder}
                                    />
                                </div>
                            </ScrollAnchor>
                            <div className={classes.buttonWrapper}>{placeOrderButton}</div>
                        </div>
                    </div>
                </section>
                <div className={classes.placeOrderBarMobile}>
                    <ScrollAnchor ref={termsAndConditionsRef}>
                        <div className={classes.termsAndConditionsWrapper}>
                            <TermsAndConditions
                                onSuccess={setTermsAndConditionsDone}
                                resetSuccess={resetTermsAndConditionsDone}
                                onError={onTermsAndConditionsError}
                                shouldSubmit={isReviewOrder}
                                resetShouldSubmit={resetReviewOrder}
                            />
                        </div>
                    </ScrollAnchor>
                    <div className={classes.buttonWrapper}>{placeOrderButton}</div>
                </div>
                <MaskedFullPageLoadingIndicator isActive={placeOrderLoading || isPaymentLoading}>
                    <FormattedMessage id={'checkoutPage.placingOrder'} defaultMessage={'Placing order...'} />
                </MaskedFullPageLoadingIndicator>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleCheckout',
                    defaultMessage: 'Checkout'
                })}
            </StoreTitle>
            {checkoutContent}
        </div>
    );
};

export default CheckoutPage;
