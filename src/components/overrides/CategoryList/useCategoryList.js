import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CategoryList/categoryList.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ childCategories: array, error: object }}
 */
export const useCategoryList = props => {
    const { id } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryListQuery, getStoreConfigQuery } = operations;

    const { loading, error, data } = useQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !id,
        variables: {
            id
        }
    });

    const { data: storeConfigData, loading: storeConfigLoading } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        childCategories: (data && data.category && data.category.children) || null,
        storeConfig,
        error,
        loading: loading || storeConfigLoading
    };
};
