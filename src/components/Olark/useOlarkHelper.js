import { useLayoutEffect } from 'react';

export const useOlarkHelper = needToHide => {
    useLayoutEffect(() => {
        if (!window.document || needToHide == null) return;

        const e = document.getElementById('olark-wrapper');

        if (!e) return;

        if (needToHide) {
            e?.classList.add('hidden');
        } else {
            e?.classList.remove('hidden');
        }
    }, [needToHide]);
};

export const useOlarkHelperToMove = needToMove => {
    useLayoutEffect(() => {
        if (!window.document || needToMove == null) return;

        const e = document.getElementById('olark-wrapper');

        if (!e) return;

        if (needToMove) {
            e?.classList.add('move-button');
        } else {
            e?.classList.remove('move-button');
        }
    }, [needToMove]);
};
