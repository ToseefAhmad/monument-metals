import { string, bool, func } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { CreditCard, Echeck, Paypal, Check, WireTransfer } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './paymentMethod.module.css';
import PaymentMethodShimmer from './paymentMethod.shimmer';
import { usePaymentMethod } from './usePaymentMethod';

const PAYMENT_METHOD_CONFIGURATIONS = {
    echeck: {
        logo: Echeck,
        component: true
    },
    plaid_echeck: {
        logo: Echeck,
        component: true
    },
    aw_nmi: {
        logo: CreditCard,
        component: true
    },
    aw_nmi_cc_vault: {
        logo: CreditCard,
        component: false
    },
    paypal_express: {
        logo: Paypal,
        component: false
    },
    checkmo: {
        logo: Check,
        component: true
    },
    banktransfer: {
        logo: WireTransfer,
        component: true
    }
};

const PaymentMethod = ({ onPaymentError, onPaymentSuccess, resetShouldSubmit, shouldSubmit }) => {
    const { paymentMethod, isLoading } = usePaymentMethod({
        onPaymentError,
        shouldSubmit
    });
    const { formatMessage } = useIntl();

    // In case current payment method doesn't have its own component - call on payment success that is done
    useEffect(() => {
        if (!isLoading && paymentMethod) {
            const { code } = paymentMethod;
            const shouldRenderPaymentMethodComponent =
                PAYMENT_METHOD_CONFIGURATIONS[code] && PAYMENT_METHOD_CONFIGURATIONS[code].component;

            if (!shouldRenderPaymentMethodComponent) {
                onPaymentSuccess();
            }
        }
    }, [isLoading, onPaymentSuccess, paymentMethod]);

    if (isLoading) {
        return <PaymentMethodShimmer />;
    }

    if (!paymentMethod) {
        return (
            <div className={classes.paymentErrors}>
                <span>
                    {formatMessage({
                        id: 'checkoutPage.paymentLoadingError',
                        defaultMessage: 'There was an error loading payments.'
                    })}
                </span>{' '}
                <span>
                    {formatMessage({
                        id: 'checkoutPage.refreshOrTryAgainLater',
                        defaultMessage: 'Please refresh or try again later.'
                    })}
                </span>
            </div>
        );
    }

    const { code, title } = paymentMethod;

    const id = `paymentMethod--${code}`;
    const PaymentMethodComponent = payments[code];
    const LogoComponent = PAYMENT_METHOD_CONFIGURATIONS[code] && PAYMENT_METHOD_CONFIGURATIONS[code].logo;
    const icon = LogoComponent ? <Icon src={LogoComponent} /> : <Icon src={Check} />;
    const isPaymentMethodComponent =
        PAYMENT_METHOD_CONFIGURATIONS[code] && PAYMENT_METHOD_CONFIGURATIONS[code].component;

    return (
        <div className={classes.root}>
            <RadioGroup
                classes={{ root: classes.radioGroup }}
                field="selectedPaymentMethod"
                validate={isRequired}
                initialValue={code}
            >
                <div className={classes.paymentMethod_active}>
                    <Radio
                        id={id}
                        label={title}
                        value={code}
                        classes={{
                            root: classes.radioRoot,
                            root_active: classes.radioRootActive
                        }}
                        checked={true}
                        active={true}
                        icon={icon}
                    />
                    {isPaymentMethodComponent && (
                        <div className={classes.paymentMethodWrapper}>
                            <PaymentMethodComponent
                                onPaymentSuccess={onPaymentSuccess}
                                onPaymentError={onPaymentError}
                                resetShouldSubmit={resetShouldSubmit}
                                shouldSubmit={shouldSubmit}
                            />
                        </div>
                    )}
                </div>
            </RadioGroup>
        </div>
    );
};

PaymentMethod.propTypes = {
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};

export default PaymentMethod;
