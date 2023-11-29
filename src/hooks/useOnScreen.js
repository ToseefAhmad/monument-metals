import { useState, useCallback, useMemo } from 'react';

/**
 * Observe if ref is visible on screen
 */
export const useOnScreen = () => {
    const [isVisible, setIsVisible] = useState(false);

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }),
        []
    );

    const ref = useCallback(
        node => {
            if (node) {
                observer.observe(node);
            } else {
                observer.disconnect();
            }

            // Save a reference to the node
            ref.current = node;
        },
        [observer]
    );

    return {
        isVisible,
        ref
    };
};
