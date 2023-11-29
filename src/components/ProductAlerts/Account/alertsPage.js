import React from 'react';
import { FormattedMessage } from 'react-intl';

import { STOCK_ALERTS, PRICE_ALERTS, METAL_ALERTS } from '../shared';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import MetalPriceButton from '@app/components/ProductAlerts/MetalPrice/metalPriceButton';

import AlertList from './alertList';
import classes from './alertsPage.module.css';
import MetalInformationOperations from './gql/metalInformation.gql';
import PriceInformationOperations from './gql/priceInformation.gql';
import StockInformationOperations from './gql/stockInformation.gql';

const AlertsPage = () => {
    return (
        <AccountPageWrapper pageTitle="Alerts">
            <div className={classes.root}>
                <div>
                    <div className={classes.header}>
                        <h3>
                            <FormattedMessage id={'productAlerts.metalAlertTitle'} defaultMessage={'Market Alerts'} />
                        </h3>
                        <MetalPriceButton classes={{ root: classes.marketAlertButton }} />
                    </div>
                    <AlertList type={METAL_ALERTS} operations={MetalInformationOperations} />
                </div>
                <div>
                    <h3>
                        <FormattedMessage id={'productAlerts.priceAlertTitle'} defaultMessage={'Price Alerts'} />
                    </h3>
                    <AlertList type={PRICE_ALERTS} operations={PriceInformationOperations} />
                </div>
                <div>
                    <h3>
                        <FormattedMessage id={'productAlerts.stockAlertTitle'} defaultMessage={'Stock Alerts'} />
                    </h3>
                    <AlertList type={STOCK_ALERTS} operations={StockInformationOperations} />
                </div>
            </div>
        </AccountPageWrapper>
    );
};

export default AlertsPage;
