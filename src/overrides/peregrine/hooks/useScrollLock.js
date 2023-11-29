import { useLayoutEffect, useRef } from 'react';

import { useOlarkHelper } from '@app/components/Olark/useOlarkHelper';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that sets
 * an attribute on the document element indicating that scrolling should be
 * locked. This is performed with a layout effect (before paint).
 *
 * @kind function
 *
 * @param {Boolean} locked Whether scrolling should be locked.
 */
export const useScrollLock = locked => {
    const scrollPosition = useRef();

    // To hide Olark chat button when some of popup is open
    useOlarkHelper(locked);

    useLayoutEffect(() => {
        if (!globalThis.document) return;

        document.documentElement.dataset.scrollLock = locked || '';
        if (locked) {
            // ios hack, make page fixed, add negative top value, then unset it when scroll lock off
            scrollPosition.current = window.pageYOffset;
            document.documentElement.style.top = `-${window.pageYOffset}px`;
            document.documentElement.style.position = 'fixed';
        } else {
            document.documentElement.style.removeProperty('position');
            document.documentElement.style.removeProperty('top');
            window.scrollTo(0, scrollPosition.current);
        }
    }, [locked]);
};
