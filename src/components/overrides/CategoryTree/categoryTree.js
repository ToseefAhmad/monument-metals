import { bool, func, object, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.module.css';
import { useCategoryTree } from './useCategoryTree';

const Tree = props => {
    const { onNavigate, setCategoryId, categoriesData, isTopLevel, loading } = props;

    const talonProps = useCategoryTree({
        categoriesData,
        isTopLevel
    });

    const { data, childCategories } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    if (loading) {
        return <LoadingIndicator />;
    }

    // For each child category, render a direct link if it has no children
    // Otherwise render a branch
    const branches = data
        ? Array.from(childCategories, childCategory => {
              const [id, { category, isLeaf }] = childCategory;
              return isLeaf ? (
                  <Leaf key={id} category={category} onNavigate={onNavigate} categoryUrlSuffix={category.url_suffix} />
              ) : (
                  <Branch key={id} category={category} setCategoryId={setCategoryId} />
              );
          })
        : null;

    return (
        <div className={classes.root}>
            <ul className={classes.tree}>{branches}</ul>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categoriesData: object,
    classes: shape({
        root: string,
        tree: string
    }),
    onNavigate: func.isRequired,
    setCategoryId: func.isRequired,
    isTopLevel: bool.isRequired,
    loading: bool
};
