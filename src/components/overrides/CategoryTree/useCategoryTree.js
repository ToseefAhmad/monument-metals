import { useQuery } from '@apollo/client';
import { object, bool } from 'prop-types';
import { useMemo } from 'react';

import { GetCategoryUrlSuffix } from './categoryTree.gql';

/**
 * @typedef {object} CategoryNode
 * @prop {object} category - category data
 * @prop {boolean} isLeaf - true if the category has no children
 */

/**
 * Returns props necessary to render a CategoryTree component.
 *
 * @param {object} props
 * @param {object} categoriesData
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
export const useCategoryTree = props => {
    const { categoriesData: data, isTopLevel } = props;

    const { data: categoryUrlData } = useQuery(GetCategoryUrlSuffix, {
        fetchPolicy: 'cache-and-network'
    });

    const categoryUrlSuffix = useMemo(() => {
        if (categoryUrlData) {
            return categoryUrlData.storeConfig.category_url_suffix;
        }
    }, [categoryUrlData]);

    const rootCategory = data && data.category;

    const { children = [] } = rootCategory || {};

    const childCategories = useMemo(() => {
        const childCategories = new Map();

        children.map(category => {
            if (category.include_in_menu) {
                const isLeaf = !parseInt(category.children_count);
                childCategories.set(category.id, { category, isLeaf });
            }
        });

        // Add the root category when appropriate.
        if (rootCategory && rootCategory.include_in_menu && rootCategory.url_path && !isTopLevel) {
            childCategories.set(rootCategory.id, {
                category: rootCategory,
                isLeaf: true
            });
        }

        return childCategories;
    }, [children, rootCategory, isTopLevel]);

    return { childCategories, data, categoryUrlSuffix };
};

useCategoryTree.propTypes = {
    categoriesData: object,
    isTopLevel: bool
};
