import { string, number } from 'prop-types';
import React, { useCallback, useState } from 'react';

import BackToTop from '@app/components/BackToTop';
import CategoryList from '@app/components/overrides/CategoryList';
import { StoreTitle, Meta, OgMeta } from '@app/components/overrides/Head';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import classes from './category.module.css';
import CategoryContent from './categoryContent';
import CategoryTitle from './categoryTitle';
import { useCategory } from './useCategory';

const Category = ({ id, children_count, display_subcategories_list }) => {
    const {
        error,
        categoryName,
        metaTitle,
        metaDescription,
        metaKeywords,
        categoryData,
        categoryDescription,
        categoryChildrenCount,
        isCategoryChildrens,
        isShowLoader
    } = useCategory({
        id,
        children_count,
        display_subcategories_list
    });
    const [isHidden, setIsHidden] = useState(false);
    const setNoProductPage = useCallback(
        value => {
            setIsHidden(value);
        },
        [setIsHidden]
    );

    if (isShowLoader) {
        return fullPageLoadingIndicator;
    }

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} classes={{ root: classes.categoryDescription }} />
    ) : null;

    if (!categoryData && error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }

        return <ErrorView />;
    }

    const content =
        isCategoryChildrens && categoryChildrenCount && categoryChildrenCount > 0 ? (
            <CategoryList id={id} count={categoryChildrenCount} />
        ) : (
            <CategoryContent
                categoryId={id}
                classes={classes}
                setNoProductPage={setNoProductPage}
                categoryName={categoryName}
            />
        );

    return (
        <>
            <StoreTitle>{metaTitle || categoryName}</StoreTitle>
            <Meta name="title" content={metaTitle} />
            <Meta name="description" content={metaDescription} />
            <OgMeta property="og:title" content={metaTitle} />
            <OgMeta property="og:description" content={metaDescription} />
            <OgMeta property="og:type" content="website" />
            <Meta name="keywords" content={metaKeywords} />
            <Breadcrumbs categoryId={id} />
            {!isHidden && <CategoryTitle categoryId={id} data={categoryData} />}
            <div className={classes.content}>{content}</div>
            {!isHidden && categoryDescriptionElement}
            {!isHidden && <CmsBlock identifiers={'shopperApproved-block'} classes={{ root: classes.trustPilot }} />}
            <BackToTop />
        </>
    );
};

Category.propTypes = {
    id: number,
    children_count: string,
    display_subcategories_list: number
};

Category.defaultProps = {
    id: 3
};

export default Category;
