import React, { forwardRef } from 'react';

const Breadcrumb = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                opacity="0.5"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289L1.58579 3L0.292893 1.70711C-0.097631 1.31658 -0.097631 0.683417 0.292893 0.292893C0.683418 -0.097631 1.31658 -0.097631 1.70711 0.292893L3.70711 2.29289C4.09763 2.68342 4.09763 3.31658 3.70711 3.70711L1.70711 5.70711C1.31658 6.09763 0.683417 6.09763 0.292893 5.70711Z"
                fill="#111927"
                {...rest}
            />
        </svg>
    );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
