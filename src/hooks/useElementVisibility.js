/* eslint-disable func-style */
import { useState, useRef, useEffect } from 'react';

import { useOnScroll } from '@app/hooks/useOnScroll';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

// Checks if element is currently in the viewport (accounts only for vertical scrolling)
export const useElementVisibility = () => {
    const TOP_OFFSET = 100;
    const { innerHeight } = useWindowSize();
    const elementRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);

    // Set use memo here?
    const [windowHeight, setWindowHeight] = useState(innerHeight);

    function checkVisibility() {
        setWindowHeight(innerHeight);

        if (elementRef.current) {
            const domRect = elementRef.current.getBoundingClientRect();

            if (domRect.bottom - TOP_OFFSET > 0) {
                if (domRect.bottom > windowHeight) {
                    setIsVisible(false);
                } else if (domRect.bottom < windowHeight) {
                    setIsVisible(true);
                }
            } else if (domRect.bottom - TOP_OFFSET < 0) {
                setIsVisible(false);
            }
        }
    }

    useOnScroll(globalThis.document, checkVisibility);

    useEffect(checkVisibility);

    return {
        isVisible,
        elementRef
    };
};
