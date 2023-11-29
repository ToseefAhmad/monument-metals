import React, { forwardRef } from 'react';

const Minimize = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.4" width="10" height="2" rx="1" fill="#111927" {...rest} />
        </svg>
    );
});

Minimize.displayName = 'Minimize';

export default Minimize;
