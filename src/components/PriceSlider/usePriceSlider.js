import { useCallback, useRef } from 'react';

export const usePriceSlider = ({ items, filterState }) => {
    let minPrice = 0;
    let maxPrice = 0;

    if (items?.length) {
        const minRange = items[0]?.value;
        const maxRange = items[items.length - 1]?.value;
        minPrice = parseInt(minRange.split('_')[0]);
        maxPrice = parseInt(maxRange.split('_')[1]);
    }

    let defaultRange = [minPrice, maxPrice];

    if (filterState && [...filterState].length) {
        defaultRange = [
            parseInt([...filterState][0].value.split('_')[0]),
            parseInt([...filterState][0].value.split('_')[1])
        ];
    }

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    return {
        minPrice,
        maxPrice,
        defaultRange,
        formApiRef,
        setFormApi
    };
};
