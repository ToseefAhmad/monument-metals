import { func } from 'prop-types';

import { usePayPal } from './usePayPal';

const PayPal = ({ onPaymentSuccess, onPaymentError }) => {
    usePayPal({ onPaymentSuccess, onPaymentError });
    return null;
};

PayPal.propTypes = {
    onPaymentSuccess: func,
    onPaymentError: func
};

export default PayPal;
