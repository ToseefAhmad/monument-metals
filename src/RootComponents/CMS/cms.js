import { number, string } from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';

import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import { Meta, StoreTitle, RichSnippet, OgMeta } from '@app/components/overrides/Head';
import { useDynamicStyles, CMS_PAGE_TYPE } from '@app/hooks/useDynamicStyles';
import CmsMenu from '@app/pageBuilder/ContentTypes/CmsMenu';
import lazyStyles from '@app/theme-monument/styles/pages/lazyStyles.json';
import CategoryList from '@magento/venia-ui/lib/components/CategoryList';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import CMSPageShimmer from './cms.shimmer';
import CMSHomePageShimmer from './cmsHomePage.shimmer';
import { useCmsPage } from './useCmsPage';

const HOME_PAGE_ID = 'home';

const CMSPage = ({ identifier }) => {
    const { cmsPage, hasContent, rootCategoryId, shouldShowLoadingIndicator, richSnippet, loading } = useCmsPage({
        identifier
    });
    const { formatMessage } = useIntl();
    const { isStylesLoading } = useDynamicStyles({ identifier, styles: lazyStyles, type: CMS_PAGE_TYPE });

    // Remove body classes for cms pages on component unmount
    const removeBodyClass = useCallback(() => document.body.classList.remove('cms-page', 'cms-' + identifier), [
        identifier
    ]);

    // Set body classes for cms pages
    useEffect(() => {
        document.body.classList.add('cms-page', 'cms-' + identifier);

        return removeBodyClass;
    }, [identifier, removeBodyClass]);

    // CMS home page shimmers
    if ((shouldShowLoadingIndicator || isStylesLoading || loading) && identifier === HOME_PAGE_ID) {
        return <CMSHomePageShimmer />;
    }

    if (shouldShowLoadingIndicator || isStylesLoading) {
        return <CMSPageShimmer />;
    }

    if (hasContent) {
        const { content_heading, title, meta_title, meta_description, meta_keywords, content, page_layout } = cmsPage;
        const headingElement = content_heading !== '' ? <h1>{content_heading}</h1> : null;
        const pageTitle = meta_title || title;
        const maybeBreadcrumbs = identifier !== HOME_PAGE_ID ? <Breadcrumbs staticPage={title} /> : null;

        return (
            <>
                {maybeBreadcrumbs}
                <StoreTitle>{pageTitle}</StoreTitle>
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                <OgMeta property="og:title" content={pageTitle} />
                <OgMeta property="og:description" content={meta_description} />
                <OgMeta property="og:type" content="website" />
                <Meta name="keywords" content={meta_keywords} />
                <RichSnippet>{richSnippet}</RichSnippet>
                {page_layout === 'cms-page-with-menu-banner' && <CmsMenu identifier={identifier} />}
                {headingElement}
                <RichContent html={content} />
            </>
        );
    }

    // Fallback to a category list if there is no cms content.
    return (
        <CategoryList
            title={formatMessage({
                id: 'cms.shopByCategory',
                defaultMessage: 'Shop by category'
            })}
            id={rootCategoryId}
        />
    );
};

CMSPage.propTypes = {
    id: number,
    identifier: string
};

export default CMSPage;
