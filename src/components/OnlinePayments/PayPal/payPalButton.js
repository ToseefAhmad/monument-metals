import { FUNDING, PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { func, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './payPalButton.module.css';
import { usePayPalButton } from './usePayPalButton';

const paypalButtonStyle = {
    height: 40,
    shape: 'rect',
    color: 'black',
    label: 'pay'
};

const PayPalButton = ({ handlePlaceOrder, disabled }) => {
    const {
        config,
        generateToken,
        configLoading,
        handleSuccess,
        handleError,
        handleCancel,
        isDisabled
    } = usePayPalButton({
        handlePlaceOrder,
        disabled
    });
    const { locale } = useIntl();

    if (configLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'bankTransfer.loadingPayment'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    return (
        <div className={classes.root}>
            <PayPalScriptProvider
                options={{
                    'client-id': config.paypal_client_id,
                    'merchant-id': config.paypal_merchant_id,
                    currency: config.base_currency,
                    commit: true,
                    intent: 'capture',
                    locale: locale.replace('-', '_')
                }}
            >
                <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={paypalButtonStyle}
                    disabled={isDisabled}
                    createOrder={() => {
                        return generateToken().then(data => {
                            return data.data.createPaypalExpressToken.token;
                        });
                    }}
                    onApprove={handleSuccess}
                    onError={handleError}
                    onCancel={handleCancel}
                />
            </PayPalScriptProvider>
        </div>
    );
};

PayPalButton.propTypes = {
    handlePlaceOrder: func,
    disabled: bool
};

export default PayPalButton;
