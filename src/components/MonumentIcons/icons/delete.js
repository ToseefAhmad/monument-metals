import { string } from 'prop-types';
import React, { forwardRef } from 'react';

const Delete = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 2C3 0.895386 3.89539 0 5 0H11C12.1046 0 13 0.895386 13 2V4H15C15.5522 4 16 4.44775 16 5C16 5.55225 15.5522 6 15 6H14V14C14 15.1046 13.1046 16 12 16H4C2.89539 16 2 15.1046 2 14V6H1C0.447754 6 0 5.55225 0 5C0 4.44775 0.447754 4 1 4H3V2ZM4 6H12V14H4V6ZM5 4H11V2H5V4ZM9 8H7V12H9V8Z"
                fill={color}
                {...rest}
            />
        </svg>
    );
});

Delete.displayName = 'Delete';

Delete.propTypes = {
    color: string
};

export default Delete;
