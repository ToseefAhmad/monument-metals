import { useLazyQuery } from '@apollo/client';
import { useState, useEffect, useMemo } from 'react';

export const useInStockCategory = ({ getCategoryListQuery, getCategoriesData }) => {
    const [isInStockCategory, setIsInStockCategory] = useState(false);

    const [getInStockCategories, { data: inStockCategoriesData, loading: isInStockCategoriesLoading }] = useLazyQuery(
        getCategoryListQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    useEffect(() => {
        if (getCategoriesData && getCategoriesData.category.in_stock_category) {
            getInStockCategories({
                variables: {
                    id: getCategoriesData.category.in_stock_connected_category_id
                }
            });
            setIsInStockCategory(true);
        } else {
            setIsInStockCategory(false);
        }
    }, [getCategoriesData, getInStockCategories]);

    const inStockCategoryIds = useMemo(() => {
        let categoryIds = null;

        const getSubcategoriesIds = categoryChildren => {
            const result = [];
            const childIds = categoryChildren.map(child => {
                if (child.children) {
                    result.push(...getSubcategoriesIds(child.children));
                }

                return child.id;
            });
            result.push(...childIds);

            return result;
        };

        if (inStockCategoriesData) {
            categoryIds = [
                inStockCategoriesData.category.id,
                ...getSubcategoriesIds(inStockCategoriesData.category.children)
            ];
        }

        return categoryIds;
    }, [inStockCategoriesData]);

    return {
        isInStockCategory,
        isInStockCategoriesLoading,
        inStockCategoryIds: isInStockCategory ? inStockCategoryIds : null
    };
};
