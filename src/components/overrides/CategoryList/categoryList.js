import { string, number } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './categoryList.module.css';
import CategoryListShimmer from './categoryList.shimmer';
import CategoryTile from './categoryTile';
import { useCategoryList } from './useCategoryList';

// Map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapCategory = categoryItem => {
    const { items } = categoryItem.productImagePreview;
    return {
        ...categoryItem,
        productImagePreview: {
            items: items.map(item => {
                const { small_image } = item;
                return {
                    ...item,
                    small_image: typeof small_image === 'object' ? small_image.url : small_image
                };
            })
        }
    };
};

const CategoryList = ({ id, count }) => {
    const { childCategories, storeConfig, error, loading } = useCategoryList({ id });
    const { formatMessage } = useIntl();

    if (loading) {
        return <CategoryListShimmer count={count} />;
    }

    let child;
    if (!childCategories) {
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        } else if (loading) {
            child = fullPageLoadingIndicator;
        }
    } else {
        if (childCategories.length) {
            child = (
                <div className={classes.content}>
                    {childCategories.map(item => (
                        <CategoryTile item={mapCategory(item)} key={item.url_key} storeConfig={storeConfig} />
                    ))}
                </div>
            );
        } else {
            return (
                <ErrorView
                    message={formatMessage({
                        id: 'categoryList.noResults',
                        defaultMessage: 'No child categories found.'
                    })}
                />
            );
        }
    }

    return <div className={classes.root}>{child}</div>;
};

CategoryList.propTypes = {
    id: number.isRequired,
    count: string
};

export default CategoryList;
