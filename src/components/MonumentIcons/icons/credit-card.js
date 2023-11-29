import React, { forwardRef } from 'react';

const CreditCard = forwardRef((_, ref) => {
    return (
        <svg ref={ref} width="35" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="35" height="24" rx="2" fill="#002147" />
            <rect x="3" y="3" width="29" height="2" fill="white" />
            <rect x="22" y="19" width="4" height="2" fill="white" />
            <rect x="28" y="19" width="4" height="2" fill="white" />
            <rect x="16" y="19" width="4" height="2" fill="white" />
            <rect x="10" y="19" width="4" height="2" fill="white" />
        </svg>
    );
});

CreditCard.displayName = 'CreditCard';

export default CreditCard;
