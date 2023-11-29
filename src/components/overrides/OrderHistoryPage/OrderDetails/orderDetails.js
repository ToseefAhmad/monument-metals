import { arrayOf, number, shape, string } from 'prop-types';
import React from 'react';
import { Printer } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';

import AccountPageWrapper from '../../../AccountPageWrapper';
import OrderProgressBar from '../orderProgressBar';
import ReorderButton from '../reorderButton';

import { ArrowLeft } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import BillingInformation from './billingInformation';
import Items from './items';
import classes from './orderDetails.module.css';
import OrderTotal from './orderTotal';
import PaymentMethod from './paymentMethod';
import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';
import TrackingDetails from './trackingDetails';
import { useOrderDetails } from './useOrderDetails';

const OrderDetails = () => {
    const { formatMessage } = useIntl();
    const { orderId } = useParams();
    const history = useHistory();

    const { order, orderLoading, imagesData, items, handleOrderPrintButtonClick, handleReorderItems } = useOrderDetails(
        {
            orderId
        }
    );

    const loadingIndicator = (
        <LoadingIndicator>
            <FormattedMessage id={'orderView.loading'} defaultMessage={'Fetching Your order'} />
        </LoadingIndicator>
    );

    if (orderLoading) {
        return (
            <AccountPageWrapper pageTitle={'My Orders'}>
                <OrderHistoryContextProvider>{loadingIndicator}</OrderHistoryContextProvider>
            </AccountPageWrapper>
        );
    }

    if (!order) {
        history.push('/order-history');
        return null;
    }

    const {
        billing_address,
        payment_methods,
        shipping_address,
        shipping_method,
        shipments,
        total,
        status,
        order_status_history
    } = order;

    const printIcon = <Icon src={Printer} size={18} />;

    const handleBack = () => {
        history.push('/order-history');
    };

    const deliveredStatus = formatMessage({
        id: 'orderRow.statusText',
        defaultMessage: status === 'Payment Received' ? 'Reviewing Payment' : status
    });

    const shippingMethodData = {
        shippingMethod: shipping_method,
        shipments
    };

    const content = orderLoading ? (
        loadingIndicator
    ) : (
        <>
            <div className={classes.headerTitle}>
                <span>
                    <FormattedMessage id={'orderViewPage.headerTitle'} defaultMessage={'Order #'} />
                </span>
                <span>{orderId}</span>
                <span> - </span>
                <span className={classes.deliveryStatus}>{deliveredStatus}</span>
            </div>
            <div className={classes.topActionBar}>
                <button className={classes.backButton} onClick={handleBack}>
                    <Icon classes={{ root: classes.backIcon }} src={ArrowLeft} />
                    <FormattedMessage id={'orderViewPage.headerActionBar.backButtonText'} defaultMessage={'Go Back'} />
                </button>
                <Button
                    onClick={() => handleOrderPrintButtonClick()}
                    classes={{ root_lowPriority: classes.printButton }}
                    priority="low"
                >
                    {printIcon}
                    <span>
                        <FormattedMessage id={'orderHistoryPage.printButton'} defaultMessage={'Print'} />
                    </span>
                </Button>
            </div>

            <OrderProgressBar
                status={deliveredStatus}
                paymentMethods={payment_methods}
                statusHistory={order_status_history}
            />
            <div className={classes.itemViewTable}>
                <div className={classes.tableHead}>
                    <span>
                        <FormattedMessage id={'orderViewPage.itemViewTable.items'} defaultMessage={'Items'} />
                    </span>
                    <span>
                        <FormattedMessage id={'orderViewPage.itemViewTable.price'} defaultMessage={'Price'} />
                    </span>
                    <span>
                        <FormattedMessage id={'orderViewPage.itemViewTable.qty'} defaultMessage={'Qty'} />
                    </span>
                    <span>
                        <FormattedMessage id={'orderViewPage.itemViewTable.total'} defaultMessage={'Total'} />
                    </span>
                </div>
                <Items items={items} imagesData={imagesData} />
                <OrderTotal data={total} />
            </div>
            <div className={classes.reorderButtonWrapper}>
                <ReorderButton handleReorderItems={handleReorderItems} />
            </div>
            <div className={classes.orderDetailsWrapper}>
                <div className={classes.heading}>
                    <h4>
                        <FormattedMessage
                            id={'orderViewPage.orderDetailsSection.heading'}
                            defaultMessage={'Order details'}
                        />
                    </h4>
                    <span>
                        <FormattedMessage
                            id={'orderViewPage.orderDetailsSection.tracking'}
                            defaultMessage={'Tracking Number: '}
                        />
                        <TrackingDetails data={shippingMethodData} />
                    </span>
                </div>
                <div className={classes.footerContent}>
                    <BillingInformation data={billing_address} />
                    <PaymentMethod data={payment_methods} />
                    <ShippingInformation data={shipping_address} />
                    <ShippingMethod data={shippingMethodData} />
                </div>
            </div>
        </>
    );

    return (
        <AccountPageWrapper pageTitle={'My Orders'}>
            <OrderHistoryContextProvider>{content}</OrderHistoryContextProvider>
        </AccountPageWrapper>
    );
};

export default OrderDetails;

OrderDetails.propTypes = {
    classes: shape({
        root: string,
        shippingInformationContainer: string,
        shippingMethodContainer: string,
        billingInformationContainer: string,
        paymentMethodContainer: string,
        itemsContainer: string,
        orderTotalContainer: string,
        printButton: string,
        printLabel: string
    }),
    imagesData: arrayOf(
        shape({
            id: number,
            sku: string,
            thumbnail: shape({
                url: string
            }),
            url_key: string,
            url_suffix: string
        })
    ),
    orderData: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        carrier: string,
                        number: string
                    })
                )
            })
        ),
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
