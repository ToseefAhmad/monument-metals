import React from 'react';

import { StoreTitle, Meta, RichSnippet, OgMeta } from '@app/components/overrides/Head';
import ProductFullDetail from '@app/components/overrides/ProductFullDetail';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import ProductShimmer from './product.shimmer';
import { useProduct } from './useProduct';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */

const Product = () => {
    const { storeConfigData, error, loading, product, richSnippet } = useProduct({
        mapProduct
    });

    if (loading && !product) return <ProductShimmer />;
    if (error && !product) return <ErrorView />;
    if (!product) {
        return <ProductShimmer />;
    }

    return (
        <>
            <StoreTitle>{product.meta_title || product.name}</StoreTitle>
            <Meta name="title" content={product.meta_title} />
            <Meta name="description" content={product.meta_description} />
            <OgMeta property="og:title" content={product.meta_title} />
            <OgMeta property="og:description" content={product.meta_description} />
            <OgMeta property="og:type" content="website" />
            <Meta name="keywords" content={product.meta_keyword} />
            <RichSnippet>{richSnippet}</RichSnippet>
            <ProductFullDetail product={product} storeConfigData={storeConfigData} />
        </>
    );
};

export default Product;
