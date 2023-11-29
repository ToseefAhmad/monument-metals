import React, { forwardRef } from 'react';

const Maximize = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                opacity="0.4"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 9C4 9.55228 4.44771 10 5 10C5.55229 10 6 9.55228 6 9V6H9C9.55229 6 10 5.55228 10 5C10 4.44772 9.55229 4 9 4H6V1C6 0.447716 5.55229 0 5 0C4.44771 0 4 0.447716 4 1V4H1C0.447708 4 0 4.44772 0 5C0 5.55228 0.447708 6 1 6H4V9Z"
                fill="#111927"
                {...rest}
            />
        </svg>
    );
});

Maximize.displayName = 'Maximize';

export default Maximize;
