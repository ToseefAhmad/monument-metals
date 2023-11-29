import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

const SCREEN_DESKTOP_PX = 1024;
const SCREEN_MOBILE_PX = SCREEN_DESKTOP_PX - 1;

export const useScreenSize = () => {
    const { innerWidth } = useWindowSize();

    const isDesktopScreen = innerWidth >= SCREEN_DESKTOP_PX;
    const isMobileScreen = innerWidth <= SCREEN_MOBILE_PX;

    return {
        isDesktopScreen,
        isMobileScreen
    };
};
