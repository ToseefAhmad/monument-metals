import { object, array } from 'prop-types';
import React from 'react';
import SlickSlider from 'react-slick';

import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';

import { useCarousel } from './useCarousel';

const Carousel = ({ settings, items }) => {
    const { storeConfig, handleLinkClick } = useCarousel();

    const galleryItems = items.map((item, index) => {
        return <GalleryItem key={index} item={item} storeConfig={storeConfig} onLinkClick={handleLinkClick} />;
    });

    return <SlickSlider {...settings}>{galleryItems}</SlickSlider>;
};

Carousel.propTypes = {
    settings: object,
    items: array
};

export default Carousel;
