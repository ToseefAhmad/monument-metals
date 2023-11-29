import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './useNavigation.gql';

const ROOT_CATEGORY_ID = '0';

const ancestors = {
    CREATE_ACCOUNT: 'MENU',
    FORGOT_PASSWORD: 'MENU',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

const getParentId = (categoryId, items) => {
    let parentId = 0;

    for (const key in items) {
        const matched = items[key].find(category => {
            return category.item_id === categoryId;
        });

        if (matched) {
            parentId = key;
        }
    }
    return parentId;
};

const createChildrenOfCategory = (categoryId, items) => {
    return !items[categoryId]
        ? []
        : items[categoryId].map(category => {
              return {
                  children_count:
                      items[category.item_id] && items[category.item_id].length > 0
                          ? items[category.item_id].length
                          : 0,
                  id: category.item_id,
                  include_in_menu: 1,
                  parentId: getParentId(categoryId, items),
                  name: category.title,
                  position: 1,
                  url_suffix: category.url_type === 2 ? '.html' : '',
                  url_path: category.url.replace('.html', '').slice(1)
              };
          });
};

const createCategoryObject = (categoryId, items, categoryChildren) => {
    let currentCategory = {};
    Object.values(items).forEach(categories => {
        const matched = categories.find(category => {
            return category.item_id === categoryId;
        });

        if (matched) currentCategory = matched;
    });

    return {
        category: {
            children: categoryChildren,
            id: currentCategory.item_id,
            parentId: getParentId(categoryId, items),
            include_in_menu: 1,
            name: currentCategory.title,
            url_path:
                currentCategory.url && currentCategory.url.charAt(0) === '/'
                    ? currentCategory.url.slice(1)
                    : currentCategory.url
        }
    };
};

const useCategories = ({ identifier, query, skip }) => {
    const { data, loading, error } = useQuery(query, {
        variables: { identifier: identifier },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip
    });

    const hasData =
        data &&
        !loading &&
        !error &&
        data.scandiwebMenu &&
        data.scandiwebMenu.items &&
        data.scandiwebMenu.items.length > 0;

    const items = { root: [{ icon: null, item_id: '0', parent_id: null, title: 'root', url: '/root' }] };

    hasData &&
        data.scandiwebMenu.items.forEach(item => {
            if (!items[item.parent_id]) items[item.parent_id] = [];

            items[item.parent_id].push(item);
        });

    return {
        loading,
        items
    };
};

export const useNavigation = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { GetCustomerQuery, GetScandiPwaMenu } = operations;
    // Retrieve app state from context
    const [{ drawer, accountMenuView }, { closeDrawer, setAccountMenuView }] = useAppContext();
    const [catalogState, { actions: catalogActions }] = useCatalogContext();
    const [, { getUserDetails }] = useUserContext();

    const fetchUserDetails = useAwaitQuery(GetCustomerQuery);

    // Request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

    const rootCategoryId = ROOT_CATEGORY_ID;

    // Extract relevant data from app state
    const isOpen = drawer === 'nav';
    const { categories } = catalogState;

    // Get local state
    const [categoryId, setCategoryId] = useState(ROOT_CATEGORY_ID);

    // Define local variables
    const category = categories[categoryId];
    const isTopLevel = categoryId === rootCategoryId;
    const hasModal = accountMenuView !== 'MENU';

    useEffect(() => {
        setCategoryId(ROOT_CATEGORY_ID);
    }, [isOpen]);

    // Define handlers
    const handleBack = useCallback(() => {
        const parent = ancestors[accountMenuView];

        if (parent) {
            setAccountMenuView(parent);
        } else if (category && !isTopLevel) {
            setCategoryId(category.parentId);
        } else {
            closeDrawer();
        }
    }, [accountMenuView, category, closeDrawer, isTopLevel, setAccountMenuView]);

    const handleClose = useCallback(() => {
        closeDrawer();
        // Sets next root component to show proper loading effect
    }, [closeDrawer]);

    // Create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setAccountMenuView('CREATE_ACCOUNT');
    }, [setAccountMenuView]);
    const showForgotPassword = useCallback(() => {
        setAccountMenuView('FORGOT_PASSWORD');
    }, [setAccountMenuView]);
    const showMainMenu = useCallback(() => {
        setAccountMenuView('MENU');
    }, [setAccountMenuView]);
    const showMyAccount = useCallback(() => {
        setAccountMenuView('MY_ACCOUNT');
    }, [setAccountMenuView]);
    const showSignIn = useCallback(() => {
        setAccountMenuView('SIGN_IN');
    }, [setAccountMenuView]);

    // Get categores data
    const { items, loading } = useCategories({ identifier: 'menu', query: GetScandiPwaMenu, skip: !isOpen });
    const categoryChildren = createChildrenOfCategory(categoryId, items);
    const categoriesData = createCategoryObject(categoryId, items, categoryChildren);

    // Update redux with fetched categories
    useEffect(() => {
        if (categoriesData && categoriesData.category) {
            catalogActions.updateCategories(categoriesData.category);
        }
    }, [categoriesData, catalogActions]);

    // On component unmount - close drawer (for example, it may happen when switching from mobile to desktop)
    useEffect(() => {
        return closeDrawer;
    }, [closeDrawer]);

    return {
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view: accountMenuView,
        categoriesData,
        loading
    };
};
