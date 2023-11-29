import { object, number, string, node } from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Breadcrumb } from '@app/components/MonumentIcons';
import { RichSnippet } from '@app/components/overrides/Head';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './breadcrumbs.module.css';
import Shimmer from './breadcrumbs.shimmer';
import { useBreadcrumbs } from './useBreadcrumbs';

/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the id of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
const Breadcrumbs = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { categoryId, currentProduct, staticPage } = props;
    const { currentCategory, currentCategoryPath, hasError, isLoading, normalizedData, richSnippet } = useBreadcrumbs({
        categoryId,
        currentProduct,
        staticPage
    });

    const delimeter = useMemo(
        () => (
            <span className={classes.divider}>
                <Icon src={Breadcrumb} />
            </span>
        ),
        [classes.divider]
    );

    // For all links generate a fragment like "> Text"
    const links = useMemo(() => {
        return normalizedData.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    {delimeter}
                    <Link className={classes.link} to={resourceUrl(path)}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.link, delimeter, normalizedData]);

    if (isLoading) {
        return <Shimmer />;
    }

    const richSnippetContent = <RichSnippet>{richSnippet}</RichSnippet>;

    if (staticPage) {
        return (
            <>
                {richSnippetContent}
                <BreadcrumbsWrapper>
                    {delimeter}
                    <span className={classes.currentCategory}>{staticPage}</span>
                </BreadcrumbsWrapper>
            </>
        );
    }

    // Don't display anything but the empty, static height div when there's an error.
    if (hasError) {
        return <div className={classes.root} aria-live="polite" aria-busy="false" />;
    }

    // If we have a "currentProduct" it means we're on a PDP so we want the last
    // Category text to be a link. If we don't have a "currentProduct" we're on
    // A category page so it should be regular text.
    const currentCategoryLink = currentProduct ? (
        <Link className={classes.link} to={resourceUrl(currentCategoryPath)}>
            {currentCategory}
        </Link>
    ) : (
        <span className={classes.currentCategory}>{currentCategory}</span>
    );

    const currentProductNode = currentProduct ? (
        <Fragment>
            {delimeter}
            <span className={classes.text}>{currentProduct}</span>
        </Fragment>
    ) : null;

    return (
        <>
            {richSnippetContent}
            <BreadcrumbsWrapper>
                <Fragment>
                    {links}
                    {delimeter}
                    {currentCategoryLink}
                    {currentProductNode}
                </Fragment>
            </BreadcrumbsWrapper>
        </>
    );
};

Breadcrumbs.propTypes = {
    classes: object,
    categoryId: number,
    currentProduct: string,
    staticPage: string
};

const BreadcrumbsWrapper = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.container}>
                <Link className={classes.link} to="/">
                    <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
                </Link>
                {props.children}
            </div>
        </div>
    );
};

BreadcrumbsWrapper.propTypes = {
    classes: object,
    children: node
};

export default Breadcrumbs;
