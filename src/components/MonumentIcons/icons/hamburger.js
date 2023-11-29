import React, { forwardRef } from 'react';

const Hamburger = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.447716 0.447716 0 1 0H15C15.5523 0 16 0.447716 16 1C16 1.55228 15.5523 2 15 2H1C0.447716 2 0 1.55228 0 1ZM0 15C0 14.4477 0.447716 14 1 14H15C15.5523 14 16 14.4477 16 15C16 15.5523 15.5523 16 15 16H1C0.447716 16 0 15.5523 0 15ZM1 7C0.447716 7 0 7.44772 0 8C0 8.55228 0.447716 9 1 9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H1Z"
                fill="#002147"
                {...rest}
            />
        </svg>
    );
});

Hamburger.displayName = 'Hamburger';

export default Hamburger;
