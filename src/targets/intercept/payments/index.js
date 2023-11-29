module.exports = function localIntercept(targets) {
    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');
    const paymentsConfig = [
        {
            paymentCode: 'banktransfer',
            importPath: '@app/components/OfflinePayments/BankTransfer/bankTransfer.js'
        },
        {
            paymentCode: 'checkmo',
            importPath: '@app/components/OfflinePayments/CheckMoney/checkMoney.js'
        },
        {
            paymentCode: 'echeck',
            importPath: '@app/components/OnlinePayments/EcheckPayment/echeckPayment.js'
        },
        {
            paymentCode: 'plaid_echeck',
            importPath: '@app/components/OnlinePayments/PlaidEcheck/plaidEcheck.js'
        },
        {
            paymentCode: 'aw_nmi',
            importPath: '@app/components/OnlinePayments/NmiPayment/nmiPayment.js'
        },
        {
            paymentCode: 'paypal_express',
            importPath: '@app/components/OnlinePayments/PayPal/payPal.js'
        }
    ];

    paymentsConfig.map(paymentConfig => {
        checkoutPagePaymentTypes.tap(payments => payments.add(paymentConfig));
    });
};
