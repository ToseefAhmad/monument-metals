import { object, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import ItemsReview from '../ItemsReview';
import PriceTotals from '../PriceTotals';

import ShopperApprovedProvider from '@app/components/ShopperApprovedProvider/shopperApprovedProvider';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import classes from './orderConfirmationPage.module.css';
import { useOrderConfirmationPage } from './useOrderConfirmationPage';
const ORDER_DATA_OPTIONS = { month: 'long', day: 'numeric', year: 'numeric' };

const OrderConfirmationPage = ({ data, orderNumber }) => {
    const history = useHistory();
    const { formatMessage } = useIntl();
    const { flatData } = useOrderConfirmationPage({ data, orderNumber });
    const {
        city,
        country,
        email,
        postcode,
        region,
        shippingMethod,
        street,
        telephone,
        selectedPaymentMethod,
        priceTotals
    } = flatData;

    const additionalAddressString = `${city}, ${region} ${postcode} ${country}`;
    const orderDate = new Date().toLocaleDateString('en-US', ORDER_DATA_OPTIONS);

    const redirect = () => history.push('/');

    useEffect(() => {
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleReceipt',
                    defaultMessage: 'Receipt'
                })}
            </StoreTitle>
            <div className={classes.root}>
                <h1 className={classes.headingOrderConfirm}>
                    <FormattedMessage id={'checkout.thankYou'} defaultMessage={'Thank you!'} />
                </h1>
                <div className={classes.headingOrderConfirmDescription}>
                    <p className={classes.description}>
                        <FormattedMessage
                            id={'checkout.orderInfo'}
                            defaultMessage={
                                'You have successfully placed your order. You will receive an order confirmation e-mail with the details of your order and a link to track its progress'
                            }
                        />
                    </p>
                    <div className={classes.orderNumberText}>
                        <FormattedMessage
                            id={'checkout.orderNumber'}
                            defaultMessage={'Your order number is: '}
                            values={{ orderNumber }}
                        />
                        <span className={classes.orderNumber}>{orderNumber}</span>
                    </div>
                </div>
                <div className={classes.finishOrderActions}>
                    <div className={classes.returnButton}>
                        <Button priority="normal" onClick={redirect}>
                            <FormattedMessage
                                id={'checkout.continueShoppingButton'}
                                defaultMessage={'Return to shopping'}
                            />
                        </Button>
                    </div>
                </div>

                <div className={classes.orderDetailsWrapper}>
                    <h4 className={classes.orderDetails}>
                        <FormattedMessage id={'checkout.orderDetails'} defaultMessage={'Order Details'} />
                    </h4>
                    <div className={classes.orderDetailsBlock}>
                        <div className={classes.orderDetailsColumn}>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'orderConfirmationPage.email'} defaultMessage={'Email'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{email}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.paymentMethod'} defaultMessage={'Payment Method'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{selectedPaymentMethod.title}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.orderDate'} defaultMessage={'Order Date'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{orderDate}</p>
                            </div>
                        </div>
                        <div className={classes.orderDetailsColumn}>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage
                                        id={'checkout.deliveryOptions'}
                                        defaultMessage={'Delivery Options'}
                                    />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{shippingMethod}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage
                                        id={'checkout.deliveryAddress'}
                                        defaultMessage={'Delivery Address'}
                                    />
                                </div>
                                {street.map((row, index) => (
                                    <p key={index} className={classes.orderDetailsItemValue}>
                                        {row}
                                    </p>
                                ))}
                                <p className={classes.orderDetailsItemValue}>{additionalAddressString}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.phone'} defaultMessage={'Contact Number'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{telephone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.orderSummaryWrapper}>
                    <div className={classes.orderSummary}>
                        <div className={classes.orderSummaryContainer}>
                            <h4 className={classes.orderSummaryTitle}>
                                <FormattedMessage id={'checkout.orderSummary'} defaultMessage={'Order Summary'} />
                            </h4>
                        </div>
                        <div className={classes.orderSummaryContainer}>
                            <ItemsReview data={data} />
                        </div>
                        <div className={classes.orderSummaryContainer}>
                            <PriceTotals flatData={priceTotals} />
                        </div>
                    </div>
                </div>
            </div>
            <ShopperApprovedProvider data={flatData} orderNumber={orderNumber} />
        </>
    );
};

OrderConfirmationPage.propTypes = {
    data: object.isRequired,
    orderNumber: string,
    priceTotals: object,
    cardInfo: object
};

OrderConfirmationPage.defaultProps = {
    data: undefined,
    orderNumber: string,
    priceTotals: {},
    cardInfo: {}
};

export default OrderConfirmationPage;
