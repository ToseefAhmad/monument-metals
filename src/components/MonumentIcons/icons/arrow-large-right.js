import React, { forwardRef } from 'react';

const ArrowLargeRight = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.292893 9.70711C-0.0976311 9.31658 -0.0976311 8.68342 0.292893 8.29289L3.58579 5L0.292893 1.70711C-0.097631 1.31658 -0.097631 0.683417 0.292893 0.292893C0.683418 -0.0976314 1.31658 -0.0976314 1.70711 0.292893L5.70711 4.29289C6.09763 4.68342 6.09763 5.31658 5.70711 5.70711L1.70711 9.70711C1.31658 10.0976 0.683417 10.0976 0.292893 9.70711Z"
                fill="currentColor"
                {...rest}
            />
        </svg>
    );
});

ArrowLargeRight.displayName = 'ArrowLargeRight';

export default ArrowLargeRight;
