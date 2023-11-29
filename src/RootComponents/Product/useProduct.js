import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import useTracking from '@app/hooks/useTracking/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { generateUrl } from '@magento/peregrine/lib/util/imageUtils';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './product.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getStoreConfigData - Fetches storeConfig product url suffix using a server query
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery } = operations;
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const { trackProductDetails, getProductCategories } = useTracking();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const slug = pathname.split('/').pop();
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data } = useQuery(getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey
        }
    });

    const isBackgroundLoading = !!data && loading;

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // Display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(item => item.url_key === urlKey);

        if (!product) {
            return null;
        }

        return mapProduct(product);
    }, [data, mapProduct, urlKey]);

    // Rich snippet for google search
    const richSnippet = useMemo(() => {
        if (!product) {
            return null;
        }

        const images = product.media_gallery_entries.reduce((prevImages, image) => {
            const baseUrl = globalThis.location.origin;
            const imagesRatio = [1 / 1, 4 / 3, 16 / 9];

            return [
                ...prevImages,
                ...imagesRatio.map(ratio => {
                    return new URL(generateUrl(image.file, 'image-product')(640, 640 / ratio), baseUrl).href;
                })
            ];
        }, []);

        const productUrl = globalThis.location.href;

        let availability = '';
        switch (product.stock_status) {
            case 'IN_STOCK':
                availability = 'https://schema.org/InStock';
                break;
            case 'OUT_OF_STOCK':
                availability = 'https://schema.org/OutOfStock';
                break;
            case 'PREORDER':
                availability = 'https://schema.org/PreOrder';
                break;
        }

        return {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: images,
            description: product.meta_description,
            sku: product.sku,
            offers: {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency: product.price_range.maximum_price.final_price.currency,
                price: product.price_range.maximum_price.final_price.value,
                availability: availability
            }
        };
    }, [product]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        if (product) {
            trackProductDetails({
                product: {
                    name: product.name,
                    sku: product.sku,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    quantity: 1,
                    category: getProductCategories(product.categories)
                }
            });
        }
    }, [getProductCategories, product, trackProductDetails]);

    return {
        storeConfigData,
        error,
        loading,
        product,
        richSnippet
    };
};
