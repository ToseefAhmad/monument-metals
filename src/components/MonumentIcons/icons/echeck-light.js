import React, { forwardRef } from 'react';

const EcheckLight = forwardRef((_, ref) => {
    return (
        <svg ref={ref} width="35" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="35" height="24" rx="2" fill="white" />
            <path
                d="M2 12.7913C2 14.1391 3.01983 15 4.37041 15C5.05949 15 5.75775 14.8 6.19876 14.4174L5.68425 13.7043C5.39943 13.9652 4.91249 14.1217 4.49904 14.1217C3.74565 14.1217 3.29546 13.6783 3.22196 13.1478H6.52033V12.9043C6.52033 11.5304 5.61994 10.5913 4.29691 10.5913C2.94633 10.5913 2 11.5739 2 12.7913ZM4.29691 11.4696C5.06868 11.4696 5.36268 12 5.39024 12.4H3.20358C3.25871 11.9826 3.57109 11.4696 4.29691 11.4696Z"
                fill="#111927"
            />
            <path
                d="M10.3124 15C11.7089 15 12.4807 14.2957 12.9217 13.5739L11.8008 13.0609C11.5435 13.5391 10.9923 13.9043 10.3124 13.9043C9.24662 13.9043 8.4381 13.0957 8.4381 12C8.4381 10.9043 9.24662 10.0957 10.3124 10.0957C10.9923 10.0957 11.5435 10.4696 11.8008 10.9391L12.9217 10.4174C12.4899 9.69565 11.7089 9 10.3124 9C8.52079 9 7.09671 10.2174 7.09671 12C7.09671 13.7826 8.52079 15 10.3124 15Z"
                fill="#111927"
            />
            <path
                d="M16.675 14.8957H17.8419V11.913C17.8419 11.0957 17.3733 10.5913 16.3994 10.5913C15.6736 10.5913 15.1223 10.9217 14.8375 11.2435V9.09565H13.6707V14.8957H14.8375V12.0696C15.0396 11.8174 15.398 11.5739 15.8482 11.5739C16.3535 11.5739 16.675 11.7565 16.675 12.3391V14.8957Z"
                fill="#111927"
            />
            <path
                d="M18.7154 12.7913C18.7154 14.1391 19.7353 15 21.0858 15C21.7749 15 22.4732 14.8 22.9142 14.4174L22.3997 13.7043C22.1149 13.9652 21.6279 14.1217 21.2145 14.1217C20.4611 14.1217 20.0109 13.6783 19.9374 13.1478H23.2358V12.9043C23.2358 11.5304 22.3354 10.5913 21.0123 10.5913C19.6618 10.5913 18.7154 11.5739 18.7154 12.7913ZM21.0123 11.4696C21.7841 11.4696 22.0781 12 22.1057 12.4H19.919C19.9741 11.9826 20.2865 11.4696 21.0123 11.4696Z"
                fill="#111927"
            />
            <path
                d="M23.7938 12.7913C23.7938 14.087 24.7768 15 26.1458 15C27.0554 15 27.6066 14.6261 27.9006 14.2348L27.1381 13.5652C26.9267 13.8435 26.6052 14.0174 26.2009 14.0174C25.4935 14.0174 24.9973 13.5217 24.9973 12.7913C24.9973 12.0609 25.4935 11.5739 26.2009 11.5739C26.6052 11.5739 26.9267 11.7304 27.1381 12.0261L27.9006 11.3478C27.6066 10.9652 27.0554 10.5913 26.1458 10.5913C24.7768 10.5913 23.7938 11.5043 23.7938 12.7913Z"
                fill="#111927"
            />
            <path
                d="M31.5392 14.8957H33L31.19 12.6L32.9449 10.6957H31.5116L29.8303 12.5652V9.09565H28.6634V14.8957H29.8303V13.8174L30.3631 13.2783L31.5392 14.8957Z"
                fill="#111927"
            />
        </svg>
    );
});

EcheckLight.displayName = 'EcheckLight';

export default EcheckLight;