import React, { forwardRef } from 'react';

const PriceUp = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="5" height="4" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.361884 4L4.63812 4C4.94099 4 5.10937 3.58723 4.92017 3.30858L2.78205 0.159717C2.63746 -0.0532396 2.36255 -0.0532396 2.21795 0.159717L0.0798293 3.30858C-0.109374 3.58723 0.0590105 4 0.361884 4Z"
                fill="#09AF1B"
                {...rest}
            />
        </svg>
    );
});

PriceUp.displayName = 'PriceUp';

export default PriceUp;
