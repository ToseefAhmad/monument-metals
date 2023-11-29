import { string, object } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { METAL_ALERTS, PRICE_ALERTS, STOCK_ALERTS, MetalType, PriceType } from '../shared';

import { Delete as DeleteIcon, CustomInfo } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Price from '@magento/venia-ui/lib/components/Price';

import classes from './alertList.module.css';
import { useAlertList } from './useAlertList';

const AlertList = ({ type, operations }) => {
    const {
        initialValues,
        loadMore,
        isLoadingWithoutData,
        isBackgroundLoading,
        handleDelete,
        isDeletingItem
    } = useAlertList({
        ...operations,
        type
    });

    if (!initialValues || isLoadingWithoutData) {
        return <LoadingIndicator />;
    }

    if (initialValues.alerts.items.length === 0) {
        if (type === METAL_ALERTS) {
            return (
                <div className={classes.emptyMarketAlerts}>
                    <Icon classes={{ root: classes.informationIcon }} src={CustomInfo} />
                    <p className={classes.emptyAlertDescription}>
                        <FormattedMessage
                            id={'alertList.noMarketAlertsText'}
                            defaultMessage={'There are no market alerts'}
                        />
                    </p>
                </div>
            );
        }

        if (type === PRICE_ALERTS) {
            return (
                <div className={classes.emptyMarketAlerts}>
                    <Icon classes={{ root: classes.priceInformationIcon }} src={CustomInfo} />
                    <span>
                        <span>
                            <span className={classes.emptyAlertDescription}>
                                <FormattedMessage
                                    id={'alertList.noPriceAlertsText'}
                                    defaultMessage={'There are no price alerts.'}
                                />
                            </span>
                            <FormattedMessage
                                id={'alertList.noPriceAlertsTextSecondary'}
                                defaultMessage={
                                    'To add a Price Alert, navigate to the product page you are interested in and create your alert there.'
                                }
                            />
                        </span>
                    </span>
                </div>
            );
        }

        if (type === STOCK_ALERTS) {
            return (
                <div className={classes.emptyMarketAlerts}>
                    <Icon classes={{ root: classes.informationIcon }} src={CustomInfo} />
                    <p className={classes.emptyAlertDescription}>
                        <FormattedMessage
                            id={'alertList.noStockAlertsText'}
                            defaultMessage={'No stock alerts are scheduled'}
                        />
                    </p>
                </div>
            );
        }
    }

    const loadMoreButton = loadMore ? (
        <Button disabled={isLoadingWithoutData || isBackgroundLoading} onClick={loadMore} priority="low">
            <FormattedMessage id={'productAlerts.loadMore'} defaultMessage={'Load More'} />
        </Button>
    ) : null;

    const headingFields = type => {
        return (
            <tr className={classes.tableHeader}>
                <th>
                    <FormattedMessage id={'alertList.headerAlertLabel'} defaultMessage={'Alert'} />
                </th>
                <th>
                    {type === STOCK_ALERTS && (
                        <FormattedMessage id={'alertList.headerDateLabel'} defaultMessage={'Qty'} />
                    )}
                </th>
                <th>
                    <FormattedMessage id={'alertList.headerDateLabel'} defaultMessage={'Date'} />
                </th>
                <th className={classes.tableAction}>
                    <FormattedMessage id={'alertList.headerActionLabel'} defaultMessage={'Action'} />
                </th>
            </tr>
        );
    };

    const contentFields = item => {
        if (type === STOCK_ALERTS) {
            return (
                <tr key={item.subscriber_id} className={classes.tableContents}>
                    <td className={classes.stockNameColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.AlertLabel'} defaultMessage={'Alert:'} />
                        </span>
                        <a className={classes.stockNameAnchor} href={item.product_data.product_url}>
                            {item.product_data.name}
                        </a>
                    </td>
                    <td className={classes.qtyColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.QtyLabel'} defaultMessage={'Qty:'} />
                        </span>
                        <span className={classes.date}>{item.qty}</span>
                    </td>
                    <td className={classes.dateColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.DateLabel'} defaultMessage={'Date:'} />
                        </span>
                        <span className={classes.date}>{item.subscribe_created_at}</span>
                    </td>
                    <td className={classes.tableAction}>
                        <button disabled={isDeletingItem} onClick={() => handleDelete(item.subscriber_id)}>
                            <Icon classes={{ root: classes.deleteIcon }} src={DeleteIcon} />
                        </button>
                    </td>
                </tr>
            );
        }

        if (type === PRICE_ALERTS) {
            return (
                <tr key={item.subscriber_id} className={classes.tableContents}>
                    <td className={classes.nameColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.AlertLabel'} defaultMessage={'Alert:'} />
                        </span>
                        <a href={item.product_data.product_url}>
                            <span>{item.product_data.sku}</span>
                        </a>
                        <span className={classes.stockStatusLabel}>
                            {PriceType(item.price_type)} {<Price currencyCode={item.currency} value={item.old_price} />}
                        </span>
                    </td>
                    <td className={classes.qtyColumn}>
                        <span className={classes.date} />
                    </td>
                    <td className={classes.dateColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.DateLabel'} defaultMessage={'Date:'} />
                        </span>
                        <span className={classes.date}>{item.subscribe_created_at}</span>
                    </td>
                    <td className={classes.tableAction}>
                        <button disabled={isDeletingItem} onClick={() => handleDelete(item.subscriber_id)}>
                            <Icon classes={{ root: classes.deleteIcon }} src={DeleteIcon} />
                        </button>
                    </td>
                </tr>
            );
        }

        if (type === METAL_ALERTS) {
            return (
                <tr key={item.subscriber_id} className={classes.tableContents}>
                    <td className={classes.nameColumn}>
                        <span className={classes.mobileNameLabel}>
                            <FormattedMessage id={'alertList.AlertLabel'} defaultMessage={'Alert:'} />
                        </span>
                        <span>{MetalType(item.metal_type)}</span>
                        <span className={classes.stockStatusLabel}>
                            {PriceType(item.price_type)}{' '}
                            {<Price currencyCode={item.currency} value={item.metal_price} />}
                        </span>
                    </td>
                    <td className={classes.qtyColumn}>
                        <span className={classes.date} />
                    </td>
                    <td className={classes.dateColumn}>
                        <span className={classes.mobileNameLabel}>Date:</span>
                        <span className={classes.date}>{item.subscribe_created_at}</span>
                    </td>
                    <td className={classes.tableAction}>
                        <button disabled={isDeletingItem} onClick={() => handleDelete(item.subscriber_id)}>
                            <Icon classes={{ root: classes.deleteIcon }} src={DeleteIcon} />
                        </button>
                    </td>
                </tr>
            );
        }
    };

    const items = initialValues.alerts.items.map(item => {
        return contentFields(item);
    });

    return (
        <div className={classes.root}>
            <table className={classes.table}>
                {headingFields(type)}
                {items}
            </table>

            {loadMoreButton}
        </div>
    );
};

AlertList.propTypes = {
    type: string,
    operations: object
};

export default AlertList;
