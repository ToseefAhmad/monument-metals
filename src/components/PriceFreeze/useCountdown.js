import { useState, useEffect, useCallback, useRef } from 'react';

import { useCheckoutProvider } from '@app/components/CheckoutPage/context';

export const useCountdown = ({ isDuplicate }) => {
    const {
        priceFreezeData,
        isPaymentLoading,
        isPlacingOrder,
        isAfterPlacingOrder,
        runPriceFreeze,
        priceFreezeDateNow,
        priceFreezeDateEnd
    } = useCheckoutProvider();

    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [countDown, setCountDown] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const popupRef = useRef(null);

    const handleConfirm = useCallback(() => {
        popupRef.current.close();
        runPriceFreeze();
    }, [popupRef, runPriceFreeze]);

    useEffect(() => {
        if (priceFreezeDateEnd && priceFreezeDateNow) {
            const value = Math.round((priceFreezeDateEnd.valueOf() - priceFreezeDateNow.valueOf()) / 1000);
            setCountDown(value);
            setIsLoaded(true);
        }

        if (isLoaded && priceFreezeData) {
            const interval = setInterval(() => {
                setCountDown(value => value - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isLoaded, priceFreezeData, priceFreezeDateEnd, priceFreezeDateNow]);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        if (countDown >= 0) {
            const minute = Math.floor(countDown / 60);
            const minuteText = minute <= 9 ? '0' + minute : minute;
            setMinutes(minuteText);

            const second = countDown - minutes * 60;
            const secondText = second <= 9 ? '0' + second : second;
            setSeconds(secondText);
        } else {
            setShouldRefresh(true);
        }
    }, [isLoaded, countDown, minutes, seconds]);

    return {
        isLoaded,
        isPaymentLoading,
        isPlacingOrder,
        isAfterPlacingOrder,
        popupRef,
        shouldShowPopup: shouldRefresh && !isDuplicate,
        minutes,
        seconds,
        handleConfirm
    };
};
