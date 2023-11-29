import { string } from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowRight = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7071 0.292893C11.3166 -0.0976311 10.6834 -0.0976311 10.2929 0.292893C9.90237 0.683417 9.90237 1.31658 10.2929 1.70711L13.5858 5L10.2929 8.29289C9.90237 8.68342 9.90237 9.31658 10.2929 9.70711C10.6834 10.0976 11.3166 10.0976 11.7071 9.70711L15.7071 5.70711C16.0976 5.31658 16.0976 4.68342 15.7071 4.29289L11.7071 0.292893ZM1 4C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6H10C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4H1Z"
                fill={color}
                {...rest}
            />
        </svg>
    );
});

ArrowRight.displayName = 'ArrowRight';

ArrowRight.propTypes = {
    color: string
};

export default ArrowRight;
