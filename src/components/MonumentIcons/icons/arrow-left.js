import { string } from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowLeft = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.29289 9.70711C4.68342 10.0976 5.31658 10.0976 5.70711 9.70711C6.09763 9.31658 6.09763 8.68342 5.70711 8.29289L2.41421 5L5.70711 1.70711C6.09763 1.31658 6.09763 0.683416 5.70711 0.292893C5.31658 -0.0976324 4.68342 -0.0976324 4.29289 0.292892L0.292894 4.29289C-0.097631 4.68342 -0.097631 5.31658 0.292894 5.70711L4.29289 9.70711ZM15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4L6 4C5.44772 4 5 4.44771 5 5C5 5.55228 5.44772 6 6 6L15 6Z"
                fill={color}
                {...rest}
            />
        </svg>
    );
});

ArrowLeft.displayName = 'ArrowLeft';

ArrowLeft.propTypes = {
    color: string
};

export default ArrowLeft;
