import { string } from 'prop-types';
import React, { forwardRef } from 'react';

const CheckMark = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L3.70711 7.70711C3.31658 8.09763 2.68342 8.09763 2.29289 7.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L3 5.58579L8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893Z"
                fill={color}
                {...rest}
            />
        </svg>
    );
});

CheckMark.displayName = 'CheckMark';

CheckMark.propTypes = {
    color: string
};

export default CheckMark;
