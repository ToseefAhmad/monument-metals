import React, { forwardRef } from 'react';

const Remove = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L4 2.58579L1.70711 0.292893C1.31658 -0.097631 0.683417 -0.0976309 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L2.58579 4L0.292893 6.29289C-0.0976308 6.68342 -0.0976308 7.31658 0.292893 7.70711C0.683418 8.09763 1.31658 8.09763 1.70711 7.70711L4 5.41421L6.29289 7.70711C6.68342 8.09763 7.31658 8.09763 7.70711 7.70711C8.09763 7.31658 8.09763 6.68342 7.70711 6.29289L5.41421 4L7.70711 1.70711Z"
                fill="currentColor"
                {...rest}
            />
        </svg>
    );
});

Remove.displayName = 'Remove';

export default Remove;
