import { arrayOf, number, shape, string } from 'prop-types';
import React from 'react';
import { Printer } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from '../Icon';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './orderRow.module.css';
import ReorderButton from './reorderButton';
import { useOrderHistoryPage } from './useOrderHistoryPage';
import { useOrderRow } from './useOrderRow';

const OrderRow = ({ order, ...props }) => {
    const { formatMessage } = useIntl();
    const { invoices, items, number: orderNumber, order_date: orderDate, status, total } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    const { handleSubmit } = useOrderHistoryPage({ orderNumber });

    const [{ id: invoiceId = '' } = {}] = invoices;

    const { handleReorderItems, handleOrderPrintButtonClick } = useOrderRow({ items, orderNumber, invoiceId });

    const history = useHistory();

    const handleOrderView = () => {
        handleSubmit(orderNumber);
        history.push('order/' + orderNumber);
    };

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const derivedStatus = formatMessage({
        id: 'orderRow.statusText',
        defaultMessage: status === 'Payment Received' ? 'Reviewing Payment' : status
    });

    const classes = useStyle(defaultClasses, props.classes);

    const printIcon = <Icon src={Printer} size={16} />;

    const orderTotalPrice =
        currency && orderTotal !== null ? <Price currencyCode={currency} value={orderTotal} /> : '-';

    return (
        <tr className={classes.root}>
            <td className={classes.orderNumberContainer}>
                <span className={classes.orderNumberLabel}>
                    <FormattedMessage id={'orderRow.orderNumberLabel'} defaultMessage={'Order ID:'} />
                </span>
                <button onClick={handleOrderView}>
                    <span className={classes.orderNumber}>{orderNumber}</span>
                </button>
                <button onClick={handleOrderView} className={classes.viewOrderButton}>
                    <FormattedMessage id={'orderRow.viewMorelabel'} defaultMessage={'View more'} />
                </button>
            </td>
            <td className={classes.orderDateContainer}>
                <span className={classes.orderDateLabel}>
                    <FormattedMessage id={'orderRow.orderDateLabel'} defaultMessage={'Date:'} />
                </span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </td>
            <td className={classes.orderStatusContainer}>
                <span className={classes.orderStatusLabel}>
                    <FormattedMessage id={'orderRow.orderStatusLabel'} defaultMessage={'Status:'} />
                </span>
                <span className={classes.orderStatusBadge}>{derivedStatus}</span>
            </td>
            <td className={classes.orderTotalContainer}>
                <span className={classes.orderTotalLabel}>
                    <FormattedMessage id={'orderRow.orderTotalLabel'} defaultMessage={'Total:'} />
                </span>
                <div className={classes.orderTotal}>{orderTotalPrice}</div>
            </td>
            <td className={classes.actionContainer}>
                <ReorderButton handleReorderItems={handleReorderItems} />

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
            </td>
        </tr>
    );
};

export default OrderRow;

OrderRow.propTypes = {
    classes: shape({
        root: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        orderNumberContainer: string,
        orderDateContainer: string,
        orderTotalContainer: string,
        orderStatusContainer: string,
        orderItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        orderNumber: string,
        orderDate: string,
        orderTotal: string,
        orderStatusBadge: string,
        content: string,
        content_collapsed: string
    }),
    order: shape({
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
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
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
                        number: string
                    })
                )
            })
        ),
        status: string,
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
