import { useMemo } from 'react';

const previewImageSize = 480;

/**
 * Returns props necessary to render a CategoryTile component.
 *
 * @returns {Object} props necessary to render a category tile
 * @returns {Object} .image - an object containing url, type and width for the category image
 * @returns {Object} .item - an object containing name and url for the category tile
 * @returns {Function} .handleClick - callback to fire on link click
 */
export const useCategoryTile = ({ item, storeConfig }) => {
    const { image, productImagePreview } = item;
    const categoryUrlSuffix = storeConfig ? storeConfig.category_url_suffix : null;

    const imageObj = useMemo(() => {
        const previewProduct = productImagePreview.items[0];
        if (image) {
            return {
                url: image,
                type: 'image-category',
                width: previewImageSize
            };
        } else if (previewProduct) {
            return {
                url: previewProduct.small_image,
                type: 'image-product',
                width: previewImageSize
            };
        } else {
            return {
                url: '',
                type: 'image-category',
                width: previewImageSize
            };
        }
    }, [image, productImagePreview]);

    const itemObject = useMemo(
        () => ({
            name: item.name,
            url: `/${item.url_key}${categoryUrlSuffix || ''}`
        }),
        [item, categoryUrlSuffix]
    );

    return {
        image: imageObj,
        item: itemObject
    };
};
