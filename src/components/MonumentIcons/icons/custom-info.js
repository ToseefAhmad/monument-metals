import React, { forwardRef } from 'react';

const CustomInfo = forwardRef(() => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58167 12.4183 0 8 0C3.58173 0 0 3.58167 0 8C0 12.4183 3.58173 16 8 16ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68628 11.3137 2 8 2C4.68628 2 2 4.68628 2 8C2 11.3137 4.68628 14 8 14ZM7 5C7 4.44775 7.44769 4 8 4C8.55231 4 9 4.44775 9 5C9 5.55225 8.55231 6 8 6C7.44769 6 7 5.55225 7 5ZM8 7C7.44769 7 7 7.44775 7 8V11C7 11.5522 7.44769 12 8 12C8.55231 12 9 11.5522 9 11V8C9 7.44775 8.55231 7 8 7Z"
                fill="currentColor"
            />
        </svg>
    );
});

CustomInfo.displayName = 'CustomInfo';

export default CustomInfo;
