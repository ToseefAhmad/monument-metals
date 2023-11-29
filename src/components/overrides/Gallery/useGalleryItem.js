import { useScreenSize } from '@app/hooks/useScreenSize';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';

export const useGalleryItem = (props = {}) => {
    const { item, storeConfig, onLinkClick } = props;
    const { isDesktopScreen } = useScreenSize();

    const productType = item ? item.__typename : null;

    const isSupportedProductType = isSupported(productType);

    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: item.sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    const handleLinkClick = () => {
        onLinkClick(item);
    };

    return { ...props, wishlistButtonProps, isSupportedProductType, handleLinkClick, isDesktopScreen };
};
