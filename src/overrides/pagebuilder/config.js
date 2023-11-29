import React from 'react';

import { BannerShimmer } from '@app/pageBuilder/ContentTypes/Banner';
import bannerConfigAggregator from '@app/pageBuilder/ContentTypes/Banner/configAggregator';
import imageConfigAggregator from '@app/pageBuilder/ContentTypes/Image/configAggregator';
import { ProductsShimmer } from '@app/pageBuilder/ContentTypes/Products';
import productsConfigAggregator from '@app/pageBuilder/ContentTypes/Products/configAggregator';
import Row from '@app/pageBuilder/ContentTypes/Row';
import rowConfigAggregator from '@app/pageBuilder/ContentTypes/Row/configAggregator';
import { SliderShimmer } from '@app/pageBuilder/ContentTypes/Slider';
import sliderConfigAggregator from '@app/pageBuilder/ContentTypes/Slider/configAggregator';
import { TaxmapShimmer } from '@app/pageBuilder/ContentTypes/TaxMap';
import taxmapConfigAggregator from '@app/pageBuilder/ContentTypes/TaxMap/configAggregator';
import { trustpilotWidgetConfigAggregator } from '@app/pageBuilder/ContentTypes/TrustpilotWidget';
import TrustpilotWidgetShimmer from '@app/pageBuilder/ContentTypes/TrustpilotWidget/trustpilotWidget.shimmer';
import blockConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Block/configAggregator';
import ButtonItem from '@magento/pagebuilder/lib/ContentTypes/ButtonItem';
import buttonItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ButtonItem/configAggregator';
import buttonsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Buttons/configAggregator';
import Column from '@magento/pagebuilder/lib/ContentTypes/Column';
import columnConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Column/configAggregator';
import ColumnGroup from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup';
import columnGroupConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup/configAggregator';
import dividerConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Divider/configAggregator';
import Heading from '@magento/pagebuilder/lib/ContentTypes/Heading';
import headingConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Heading/configAggregator';
import htmlConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Html/configAggregator';
import mapConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Map/configAggregator';
import tabItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/TabItem/configAggregator';
import tabsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Tabs/configAggregator';
import Text from '@magento/pagebuilder/lib/ContentTypes/Text';
import textConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Text/configAggregator';
import videoConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Video/configAggregator';

/* istanbul ignore next */
const contentTypesConfig = {
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    column: {
        configAggregator: columnConfigAggregator,
        component: Column
    },
    'column-group': {
        configAggregator: columnGroupConfigAggregator,
        component: ColumnGroup
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: React.lazy(() => import(/* webpackChunkName: "image" */ '@app/pageBuilder/ContentTypes/Image'))
    },
    heading: {
        configAggregator: headingConfigAggregator,
        component: Heading
    },
    text: {
        configAggregator: textConfigAggregator,
        component: Text
    },
    tabs: {
        configAggregator: tabsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Block'))
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() =>
            import(/* webpackChunkName: "products" */ '@app/pageBuilder/ContentTypes/Products')
        ),
        componentShimmer: ProductsShimmer
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import(/* webpackChunkName: "banner" */ '@app/pageBuilder/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import(/* webpackChunkName: "slider" */ '@app/pageBuilder/ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    // Slide is just a banner wrapped inside a slider
    slide: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import(/* webpackChunkName: "banner" */ '@app/pageBuilder/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    magebit_taxmap: {
        configAggregator: taxmapConfigAggregator,
        component: React.lazy(() => import(/* webpackChunkName: "taxMap" */ '@app/pageBuilder/ContentTypes/TaxMap')),
        componentShimmer: TaxmapShimmer
    },
    magebit_trustpilot: {
        configAggregator: trustpilotWidgetConfigAggregator,
        component: React.lazy(() =>
            import(/* webpackChunkName: "trustpilotWidget" */ '@app/pageBuilder/ContentTypes/TrustpilotWidget')
        ),
        componentShimmer: TrustpilotWidgetShimmer
    }
};

/**
 * Retrieve a content types configuration
 *
 * @param {string} contentType
 * @returns {*}
 */
export const getContentTypeConfig = contentType => {
    if (contentTypesConfig[contentType]) {
        return contentTypesConfig[contentType];
    }
};

/**
 * Set content types configuration with new one
 *
 * @param {string} contentType
 * @param {*} config
 * @returns {*}
 */
export const setContentTypeConfig = (contentType, config) => {
    return (contentTypesConfig[contentType] = config);
};
