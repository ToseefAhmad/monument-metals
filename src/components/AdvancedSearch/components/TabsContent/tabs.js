import { object, array, bool } from 'prop-types';
import React, { Fragment } from 'react';

import { useAmXsearchContext } from '../../context';
import { useTabs } from '../../talons/tabs/useTabs';

import Products from './products';
import TabItem from './tabItem';

const Tabs = props => {
    const { sortProps, products, pageControl, activeTab, isGridView } = props;
    const { data: tabsData, isEnabled, isHasTab } = useTabs();
    const { storeConfig } = useAmXsearchContext();

    const items =
        isEnabled && isHasTab
            ? Object.values(tabsData).map((item, index) => (
                  <TabItem
                      key={item.__typename + index}
                      activeTab={activeTab}
                      tabItem={item}
                      storeConfig={storeConfig}
                  />
              ))
            : null;

    return (
        <Fragment>
            <Products
                activeTab={activeTab}
                products={products}
                pageControl={pageControl}
                sortProps={sortProps}
                isGridView={isGridView}
            />
            {items}
        </Fragment>
    );
};

Tabs.propTypes = {
    sortProps: array,
    products: object,
    pageControl: object,
    activeTab: object,
    isGridView: bool
};

export default Tabs;
