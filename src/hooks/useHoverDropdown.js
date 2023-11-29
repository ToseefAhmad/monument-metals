import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DEBOUNCE = 200;

/**
 * Provides dropdown logic with hover trigger
 *
 * @param debounceTime
 */
export const useHoverDropdown = debounceTime => {
    const debounceAmount = typeof debounceTime !== 'undefined' ? debounceTime : DEFAULT_DEBOUNCE;
    const elementRef = useRef();
    const triggerRef = useRef();
    const [expanded, setExpanded] = useState(false);

    // Collapse on mouseover outside of the element and trigger.
    const maybeCollapse = useCallback(({ target }) => {
        const isOutsideElement = !elementRef.current || !elementRef.current.contains(target);
        const isOutsideTrigger = !triggerRef.current || !triggerRef.current.contains(target);

        if (isOutsideElement && isOutsideTrigger) {
            setExpanded(false);
        }
    }, []);
    const debouncedCollapse = debounce(maybeCollapse, debounceAmount);

    useEffect(() => {
        if (!globalThis.document) return;
        if (expanded) {
            document.addEventListener('mouseover', debouncedCollapse);
        } else {
            document.removeEventListener('mouseover', debouncedCollapse);
        }

        // Return a callback, which is called on unmount
        return () => {
            document.removeEventListener('mouseover', debouncedCollapse);
        };
    }, [debouncedCollapse, expanded]);

    return {
        elementRef,
        triggerRef,
        expanded,
        setExpanded
    };
};
