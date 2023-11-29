import { object } from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import defaultClasses from './tab.module.css';

const toHTML = str => ({ __html: str });

const TabItem = props => {
    const { tabItem, activeTab, storeConfig } = props;

    if (!storeConfig) {
        return null;
    }

    if (!storeConfig[`amasty_xsearch_${tabItem.code}_enabled`] || !tabItem.items || !tabItem.total_count) {
        return null;
    }

    const items = Object.values(tabItem.items).map(
        (item, index) =>
            activeTab.typeName === tabItem.__typename && (
                <Link
                    key={item.name + index}
                    className={defaultClasses.link}
                    dangerouslySetInnerHTML={toHTML(item.name)}
                    to={resourceUrl(item.url) || ''}
                />
            )
    );

    return <Fragment>{items}</Fragment>;
};

TabItem.propTypes = {
    tabItem: object,
    activeTab: object,
    storeConfig: object
};

export default TabItem;
