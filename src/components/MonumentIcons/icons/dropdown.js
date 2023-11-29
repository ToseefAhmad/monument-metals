import React, { forwardRef } from 'react';

const Dropdown = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                opacity="0.5"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L3 1.58579L4.29289 0.292893C4.68342 -0.0976311 5.31658 -0.0976311 5.70711 0.292893C6.09763 0.683417 6.09763 1.31658 5.70711 1.70711L3.70711 3.70711C3.31658 4.09763 2.68342 4.09763 2.29289 3.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                fill="#111927"
                {...rest}
            />
        </svg>
    );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
