/* eslint-disable react/prop-types */
import { useQuery, gql } from '@apollo/client';
import React, { useMemo } from 'react';
export { default as HeadProvider } from '@magento/venia-ui/lib/components/Head/headProvider';
import { Helmet } from 'react-helmet-async';
Helmet.defaultProps.defer = false;

import classes from './head.module.css';

export const Link = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <link {...tagProps}>{children}</link>
        </Helmet>
    );
};

export const OgMeta = props => {
    const { children, property, content, ...tagProps } = props;

    if (!property || !content) {
        return null;
    }

    return (
        <Helmet>
            <meta property={property} content={content} {...tagProps}>
                {children}
            </meta>
        </Helmet>
    );
};

export const Meta = props => {
    const { children, name, content, ...tagProps } = props;

    if (!name || !content) {
        return null;
    }

    return (
        <Helmet>
            <meta name={name} content={content} {...tagProps}>
                {children}
            </meta>
        </Helmet>
    );
};

export const Style = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <style {...tagProps}>{children}</style>
        </Helmet>
    );
};

export const Title = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <title {...tagProps}>{children}</title>
        </Helmet>
    );
};

export const Heading = props => {
    const { children } = props;

    return <h1 className={classes.heading}>{children}</h1>;
};

const STORE_NAME_QUERY = gql`
    query getStoreName {
        storeConfig {
            id
            store_name
        }
    }
`;

export const StoreTitle = props => {
    const { children, ...tagProps } = props;

    const { data: storeNameData } = useQuery(STORE_NAME_QUERY);

    const storeName = useMemo(() => {
        return storeNameData ? storeNameData.storeConfig.store_name : STORE_NAME;
    }, [storeNameData]);

    let titleText;
    if (children) {
        titleText = `${children} - ${storeName}`;
    } else {
        titleText = storeName;
    }

    return (
        <Helmet>
            <title {...tagProps}>{titleText}</title>
        </Helmet>
    );
};

export const RichSnippet = props => {
    const { children, ...tagProps } = props;

    if (!children) {
        return null;
    }

    const richSnippetJSON = JSON.stringify(children);

    return (
        <Helmet>
            <script type="application/ld+json" {...tagProps}>
                {richSnippetJSON}
            </script>
        </Helmet>
    );
};
