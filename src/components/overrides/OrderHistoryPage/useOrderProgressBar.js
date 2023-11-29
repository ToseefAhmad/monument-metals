import { useIntl } from 'react-intl';

export const useOrderProgressBar = ({ status, paymentMethods, statusHistory }) => {
    const [{ type }] = paymentMethods;
    const { formatMessage } = useIntl();

    const history = [];
    statusHistory.forEach(h => {
        const isoFormattedDate = h?.timestamp?.replace(' ', 'T');
        const formattedDate = new Date(isoFormattedDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        // place in front, so we get oldest entries first in case of duplicates
        history.unshift({
            ...h,
            timestamp: formattedDate,
            status: h.status === 'Payment Received' ? 'Reviewing Payment' : h.status
        });
    });

    let paymentPendingText = 'Payment Pending';
    switch (type) {
        case 'echeck':
            paymentPendingText = 'Echeck Clearing';
            break;
        case 'plaid_echeck':
            paymentPendingText = 'Echeck Clearing';
            break;
        case 'checkmo':
            paymentPendingText = 'Awaiting Check Payment';
            break;
        case 'cashforpickup':
            paymentPendingText = 'Awaiting Payment (Cash)';
            break;
        case 'banktransfer':
            paymentPendingText = 'Awaiting Wire Payment';
            break;
        case 'aw_nmi':
            paymentPendingText = 'Reviewing Payment';
            break;
        case 'paypal_express':
            paymentPendingText = 'Pending PayPal';
            break;
    }

    let mappedStatus = formatMessage({
        id: 'orderProgressBar.orderCreatedText',
        defaultMessage: 'Order Created'
    });

    switch (status) {
        case 'Awaiting Check Payment':
        case 'Awaiting Wire Payment':
        case 'Awaiting Payment (Cash)':
        case 'Echeck Clearing':
        case 'Check Clearing':
        case 'Awaiting Pickup':
        case 'Reviewing Payment':
        case 'Payment Under Review':
        case 'Pending PayPal':
        case 'Payment Received':
        case 'Awaiting Shipment':
        case 'Shipped':
            mappedStatus = formatMessage({
                id: 'orderProgressBar.statusText',
                defaultMessage: status
            });
            break;
    }

    // this part of mapping won't change
    const statusStepMap = [
        formatMessage({
            id: 'orderProgressBar.orderCreatedText',
            defaultMessage: 'Order Created'
        })
    ];

    // here we add any steps between order start/finish
    if (type !== 'paypal_express') {
        statusStepMap.push(
            formatMessage({
                id: 'orderProgressBar.paymentPendingText',
                defaultMessage: paymentPendingText
            })
        );
    }

    if (type === 'aw_nmi' && status === 'Payment Under Review') {
        statusStepMap.push(
            formatMessage({
                id: 'orderProgressBar.paymentUnderReviewText',
                defaultMessage: 'Payment Under Review'
            })
        );
    }

    if (type === 'checkmo') {
        statusStepMap.push(
            formatMessage({
                id: 'orderProgressBar.checkClearingText',
                defaultMessage: 'Check Clearing'
            })
        );
    }

    if (type !== 'cashforpickup') {
        statusStepMap.push(
            formatMessage({
                id: 'orderProgressBar.paidText',
                defaultMessage: 'Awaiting Shipment'
            })
        );
    } else {
        statusStepMap.push(
            formatMessage({
                id: 'orderProgressBar.paidText',
                defaultMessage: 'Awaiting Pickup'
            })
        );
    }

    statusStepMap.push(
        formatMessage({
            id: 'orderProgressBar.shippedText',
            defaultMessage: 'Shipped'
        })
    );

    return {
        mappedStatus,
        statusStepMap,
        history
    };
};
