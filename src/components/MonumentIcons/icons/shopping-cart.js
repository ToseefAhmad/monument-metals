import React, { forwardRef } from 'react';

const ShoppingCart = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 10C12 5.58167 15.582 2 20 2C24.418 2 28 5.58167 28 10V14H12V10ZM46 10V14H30V10C30 5.58167 33.582 2 38 2C42.418 2 46 5.58167 46 10ZM48 14H58C59.1046 14 60 14.8954 60 16V68C60 69.1046 59.1046 70 58 70H2C0.895431 70 0 69.1046 0 68V16C0 14.8954 0.89543 14 2 14H10V10C10 4.47717 14.4766 0 20 0C23.9531 0 27.375 2.29407 28.9961 5.62366C30.6172 2.29407 34.0469 0 38 0C43.5234 0 48 4.47717 48 10V14ZM58 16V65.5858L52 59.5858V16H58ZM50 16V59.5858L44 65.5858V16H46H48H50ZM42 16V68H2V16H10V19C10 19.5523 10.4477 20 11 20C11.5523 20 12 19.5523 12 19V16H28V19C28 19.5523 28.4477 20 29 20C29.5523 20 30 19.5523 30 19V16H42ZM51 61.4142L44.4141 68H57.5859L51 61.4142Z"
                fill="#B22234"
                {...rest}
            />
        </svg>
    );
});

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;
