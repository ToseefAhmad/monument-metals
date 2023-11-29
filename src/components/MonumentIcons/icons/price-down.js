import React, { forwardRef } from 'react';

const PriceDown = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="5" height="4" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.63812 0H0.361884C0.0590105 0 -0.109374 0.412771 0.0798297 0.691417L2.21795 3.84028C2.36255 4.05324 2.63745 4.05324 2.78205 3.84028L4.92017 0.691417C5.10937 0.412771 4.94099 0 4.63812 0Z"
                fill="#B22234"
                {...rest}
            />
        </svg>
    );
});

PriceDown.displayName = 'PriceDown';

export default PriceDown;
