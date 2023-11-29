import React, { forwardRef } from 'react';

const List = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.447754 0.447716 0 1 0H5C5.55228 0 6 0.447754 6 1V5C6 5.55225 5.55228 6 5 6H1C0.447716 6 0 5.55225 0 5V1ZM2 2H4V4H2V2ZM0 11C0 10.4478 0.447716 10 1 10H5C5.55228 10 6 10.4478 6 11V15C6 15.5522 5.55228 16 5 16H1C0.447716 16 0 15.5522 0 15V11ZM2 12H4V14H2V12ZM8 13C8 12.4478 8.44772 12 9 12H15C15.5523 12 16 12.4478 16 13C16 13.5522 15.5523 14 15 14H9C8.44772 14 8 13.5522 8 13ZM9 2C8.44772 2 8 2.44775 8 3C8 3.55225 8.44772 4 9 4H15C15.5523 4 16 3.55225 16 3C16 2.44775 15.5523 2 15 2H9Z"
                fill="white"
                {...rest}
            />
        </svg>
    );
});

List.displayName = 'List';

export default List;
