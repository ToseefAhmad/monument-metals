import React, { forwardRef } from 'react';

const Calendar = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 1C11 0.447715 10.5523 0 10 0C9.44771 0 9 0.447715 9 1V2H5V1C5 0.447715 4.55228 0 4 0C3.44772 0 3 0.447715 3 1V2H1.55556C0.696446 2 0 2.69645 0 3.55556V7V14.4444C0 15.3036 0.696446 16 1.55556 16H12.4444C13.3036 16 14 15.3036 14 14.4444V3.55556C14 2.69645 13.3036 2 12.4444 2H11V1ZM2 8V14H12V8H2ZM12 6H2V4H4H10H12V6Z"
                fill="#B22234"
                {...rest}
            />
        </svg>
    );
});

Calendar.displayName = 'Calendar';

export default Calendar;
