import { useCallback, useEffect } from 'react';

import { generateUrlFromContainerWidth } from '@magento/peregrine/lib/util/imageUtils';
import { MESSAGE_TYPES, VALID_SERVICE_WORKER_ENVIRONMENT, sendMessageToSW } from '@magento/peregrine/lib/util/swUtils';

import { useCarousel } from './useCarousel';

export const useProductImageCarousel = props => {
    const { images, type, imageWidth, visibleImages } = props;
    const [carouselState, carouselApi] = useCarousel(images, 0, visibleImages);
    const { activeItemIndex, sortedImages, firstVisibleIndex } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleThumbnailClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    // Whenever the incoming images changes reset the active item to the first.
    useEffect(() => {
        setActiveItemIndex(0);
    }, [images, setActiveItemIndex]);

    useEffect(() => {
        if (VALID_SERVICE_WORKER_ENVIRONMENT) {
            const urls = images.map(
                ({ file }) => new URL(generateUrlFromContainerWidth(file, imageWidth, type), location.origin).href
            );
            sendMessageToSW(MESSAGE_TYPES.PREFETCH_IMAGES, {
                urls
            }).catch(err => {
                console.error('Unable to send PREFETCH_IMAGES message to SW', err);
            });
        }
    }, [images, imageWidth, type]);

    const currentImage = sortedImages[activeItemIndex] || {};
    const altText = currentImage.label || 'image-product';

    return {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages,
        firstVisibleIndex
    };
};
