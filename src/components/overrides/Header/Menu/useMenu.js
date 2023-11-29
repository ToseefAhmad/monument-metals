import { useQuery } from '@apollo/client';

import { GET_SCANDIPWA_MENU } from './menu.gql.js';

export const useMenu = ({ identifier }) => {
    const { data, loading, error } = useQuery(GET_SCANDIPWA_MENU, {
        variables: { identifier: identifier },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const hasData =
        data &&
        !loading &&
        !error &&
        data.scandiwebMenu &&
        data.scandiwebMenu.items &&
        data.scandiwebMenu.items.length > 0;
    const rootItems = hasData ? data.scandiwebMenu.items.filter(item => item.parent_id === 0) : [];
    const childItems = {};

    hasData &&
        data.scandiwebMenu.items.forEach(item => {
            if (!childItems[item.parent_id]) childItems[item.parent_id] = [];

            if (item.parent_id !== 0) {
                childItems[item.parent_id].push(item);
            }
        });

    const hasChildren = rootItem => !!Object.keys(childItems).find(parentId => parentId === rootItem.item_id);

    return {
        loading,
        rootItems,
        childItems,
        hasChildren
    };
};
