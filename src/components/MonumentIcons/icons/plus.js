import React, { forwardRef } from 'react';

const Plus = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                opacity="0.4"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 0C3.44772 0 3 0.447715 3 1V3H1C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5H3V7C3 7.55228 3.44772 8 4 8C4.55228 8 5 7.55228 5 7V5H7C7.55228 5 8 4.55228 8 4C8 3.44772 7.55228 3 7 3H5V1C5 0.447715 4.55228 0 4 0Z"
                fill="#111927"
                {...rest}
            />
        </svg>
    );
});

Plus.displayName = 'Plus';

export default Plus;