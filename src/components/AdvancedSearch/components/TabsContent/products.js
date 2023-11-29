import { object, array, bool } from 'prop-types';
import React, { Fragment, useCallback } from 'react';

import RelatedTerms from '@app/components/AdvancedSearch/components/RelatedTerms';
import defaultClasses from '@app/components/overrides/ProductSort/productSort.module.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Gallery from '@magento/venia-ui/lib/components/Gallery';

import customClasses from './tab.module.css';

const Products = props => {
    const classes = mergeClasses(defaultClasses, customClasses);

    const { products, activeTab, isGridView } = props;

    const handleProductClick = useCallback(
        // eslint-disable-next-line no-unused-vars
        item => {
            // eslint-disable-next-line no-warning-comments
            // TODO: Tracking???
        },
        []
    );

    if (activeTab.typeName !== 'XsearchProducts') {
        return null;
    }

    return (
        <Fragment>
            <RelatedTerms productsQty={products.length} />

            <section className={classes.gallery}>
                <Gallery onProductClick={handleProductClick} items={products} isGridView={isGridView} />
            </section>
        </Fragment>
    );
};

Products.propTypes = {
    products: array,
    pageControl: object,
    sortProps: array,
    activeTab: object,
    isGridView: bool
};

export default Products;
