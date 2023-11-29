import { useCallback, useMemo, useState } from 'react';

const sortImages = (images = []) => images.filter(({ disabled }) => !disabled).sort((a, b) => a.position - b.position);

/**
 * A hook for interacting with the state of a carousel of images.
 * Modified version of @magento/peregrine/lib/hooks/useCarousel.js
 *
 * @param {Array} images an array of image objects
 * @param {number} startIndex the index at which to start the carousel
 */
export const useCarousel = (images = [], startIndex = 0, visibleImages = 6) => {
    const [activeItemIndex, setActiveItemIndex] = useState(startIndex);
    const [firstVisibleIndex, setFirstVisibleIndex] = useState(startIndex);

    const sortedImages = useMemo(() => sortImages(images), [images]);

    const handlePrevious = useCallback(() => {
        // If we're on the first image we want to go to the last.
        setActiveItemIndex(prevIndex => {
            if (prevIndex > 0) {
                return prevIndex - 1;
            } else {
                return images.length - 1;
            }
        });

        // On first image
        if (activeItemIndex == 0) {
            // On first image, go to last
            setFirstVisibleIndex(images.length - visibleImages);
        } else if (activeItemIndex - 1 < firstVisibleIndex) {
            // On first visible image, go one back
            setFirstVisibleIndex(prevValue => prevValue - 1);
        }
    }, [images, activeItemIndex, visibleImages, firstVisibleIndex]);

    const handleNext = useCallback(() => {
        // If we're on the last image we want to go to the first.
        setActiveItemIndex(prevIndex => (prevIndex + 1) % images.length);

        // Set first visible index
        if (activeItemIndex + 1 >= images.length) {
            // Last image reached, reset index
            setFirstVisibleIndex(0);
        } else if (activeItemIndex + 1 >= visibleImages + firstVisibleIndex) {
            // Last visible image reached, inxrease index
            setFirstVisibleIndex(prevValue => {
                return prevValue + 1;
            });
        }
    }, [images, visibleImages, activeItemIndex, firstVisibleIndex]);

    const api = useMemo(() => ({ handlePrevious, handleNext, setActiveItemIndex }), [
        handlePrevious,
        handleNext,
        setActiveItemIndex
    ]);

    const state = {
        activeItemIndex,
        sortedImages,
        firstVisibleIndex
    };

    return [state, api];
};
