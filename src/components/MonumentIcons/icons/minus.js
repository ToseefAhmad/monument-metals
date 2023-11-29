import React, { forwardRef } from 'react';

const Minus = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.4" width="8" height="2" rx="1" fill="#111927" {...rest} />
        </svg>
    );
});

Minus.displayName = 'Minus';

export default Minus;
