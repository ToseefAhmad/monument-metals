import { useQuery } from '@apollo/client';

import { getCategoryWithChildrensQuery } from './category.gql';

export const useCategory = ({ id, children_count, display_subcategories_list }) => {
    const { data: categoryData, error, loading } = useQuery(getCategoryWithChildrensQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !id,
        variables: {
            id
        }
    });

    const categoryName = categoryData ? categoryData.category.name : null;
    const categoryDescription = categoryData ? categoryData.category.description : null;
    const metaTitle =
        categoryData && categoryData.category && categoryData.category.meta_title
            ? categoryData.category.meta_title
            : '';
    const metaDescription =
        categoryData && categoryData.category && categoryData.category.meta_description
            ? categoryData.category.meta_description
            : '';
    const metaKeywords =
        categoryData && categoryData.category && categoryData.category.meta_keywords
            ? categoryData.category.meta_keywords
            : '';

    // There is bug when children_count doesn't return back from MagentoRoute component in production mode
    // So in this case getting the children count from category graphql query
    // And showing the full page loading indicator
    const categoryChildrenCount = children_count
        ? children_count
        : categoryData
        ? categoryData.category.children_count
        : 0;
    const displaySubcategoriesList =
        (display_subcategories_list && display_subcategories_list !== 0) ||
        (categoryData && categoryData.category.display_subcategories_list !== 0);
    // we check children length directly, because children_count includes disabled categories
    const isCategoryChildrens = displaySubcategoriesList && categoryChildrenCount;

    const isShowLoader = !children_count && !display_subcategories_list && loading;

    return {
        error,
        categoryData,
        categoryName,
        metaTitle,
        metaDescription,
        metaKeywords,
        categoryDescription,
        categoryChildrenCount,
        isCategoryChildrens,
        isShowLoader
    };
};
