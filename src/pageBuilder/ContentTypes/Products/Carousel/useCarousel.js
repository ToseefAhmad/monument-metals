import { useQuery } from '@apollo/client';

import useTracking from '@app/hooks/useTracking/useTracking';
import defaultOperations from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/carousel.gql';
import { useCustomerWishlistSkus } from '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * This is a duplicate of @magento/peregrine/lib/talons/Gallery/useGallery.js
 */
export const useCarousel = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    useCustomerWishlistSkus();
    const { trackProductClick, getProductCategories } = useTracking();

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    const handleLinkClick = item => {
        trackProductClick({
            listName: 'Products Slider',
            product: {
                sku: item.sku,
                name: item.name,
                price: item.price_range.maximum_price.final_price.value,
                currency: item.price_range.maximum_price.final_price.currency,
                category: getProductCategories(item.categories)
            }
        });
    };

    return {
        storeConfig,
        handleLinkClick
    };
};
