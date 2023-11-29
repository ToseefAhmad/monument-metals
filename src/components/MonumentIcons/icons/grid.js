import React, { forwardRef } from 'react';

const Grid = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.447754 0.447708 0 1 0H6C6.55229 0 7 0.447754 7 1V6C7 6.55225 6.55229 7 6 7H1C0.447708 7 0 6.55225 0 6V1ZM2 2H5V5H2V2ZM9 1C9 0.447754 9.44771 0 10 0H15C15.5523 0 16 0.447754 16 1V6C16 6.55225 15.5523 7 15 7H10C9.44771 7 9 6.55225 9 6V1ZM11 2H14V5H11V2ZM1 9C0.447708 9 0 9.44775 0 10V15C0 15.5522 0.447708 16 1 16H6C6.55229 16 7 15.5522 7 15V10C7 9.44775 6.55229 9 6 9H1ZM5 11H2V14H5V11ZM9 10C9 9.44775 9.44771 9 10 9H15C15.5523 9 16 9.44775 16 10V15C16 15.5522 15.5523 16 15 16H10C9.44771 16 9 15.5522 9 15V10ZM11 11H14V14H11V11Z"
                fill="white"
                {...rest}
            />
        </svg>
    );
});

Grid.displayName = 'Grid';

export default Grid;
