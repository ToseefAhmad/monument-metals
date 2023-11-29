import { useEventListener } from '@magento/peregrine';

const SCROLL_EVENT = 'scroll';

let passiveSupported = false;

try {
    const options = {
        get passive() {
            passiveSupported = true;
            return false;
        }
    };

    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
} catch (err) {
    passiveSupported = false;
}

/**
 * Expose onScroll event
 */
export const useOnScroll = (target, listener) => {
    let ticking = false;

    const onScroll = (...args) => {
        if (!ticking) {
            globalThis.requestAnimationFrame(() => {
                listener.apply(args[0], args);
                ticking = false;
            });

            ticking = true;
        }
    };

    useEventListener(target, SCROLL_EVENT, onScroll, passiveSupported ? { passive: true } : false);
};
