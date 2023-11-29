import { string } from 'prop-types';
import React, { forwardRef } from 'react';

const Close = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7071 1.70711C12.0976 1.31658 12.0976 0.683417 11.7071 0.292893C11.3166 -0.0976311 10.6834 -0.0976311 10.2929 0.292893L6 4.58579L1.70711 0.292894C1.31658 -0.097631 0.683417 -0.0976309 0.292893 0.292894C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L4.58579 6L0.292894 10.2929C-0.0976306 10.6834 -0.0976306 11.3166 0.292894 11.7071C0.683418 12.0976 1.31658 12.0976 1.70711 11.7071L6 7.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L7.41421 6L11.7071 1.70711Z"
                fill={color}
                {...rest}
            />
        </svg>
    );
});

Close.displayName = 'Close';

Close.propTypes = {
    color: string
};

export default Close;
