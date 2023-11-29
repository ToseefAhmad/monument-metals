import { useQuery } from '@apollo/client';
import parse from 'html-react-parser';
import { string } from 'prop-types';
import React, { useEffect } from 'react';

import { GET_CMS_BLOCKS } from '@app/components/overrides/CmsBlock/cmsBlock';
import CmsMenuShimmer from '@app/pageBuilder/ContentTypes/CmsMenu/cmsMenu.shimmer';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import classes from './cmsMenu.module.css';

const CmsMenu = ({ identifier }) => {
    const identifiers = ['cms-page-menu', `${identifier}-page-banner`];

    const { loading, error, data } = useQuery(GET_CMS_BLOCKS, {
        variables: { identifiers },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        document.body.classList.add('cms-menu-page'); // Add class for styling menu pages
        return () => {
            document.body.classList.remove('cms-menu-page');
        };
    }, []);

    if (!data) {
        if (loading) {
            return <CmsMenuShimmer />;
        }

        if (error) {
            console.error(error.message);
            return null;
        }
    }
    const [cmsMenuBlock, cmsPageBannerBlock] = data?.cmsBlocks?.items;

    const container = document.createElement('div');
    container.innerHTML = cmsMenuBlock.content;
    const links = container.querySelectorAll('.pagebuilder-button-primary');

    const pageButtons = Array.from(links).map((item, index) => (
        <a
            className={window.location.href === item.href ? classes.buttonActive : classes.button}
            href={item.href}
            key={index}
        >
            {parse(item.innerHTML)}
        </a>
    ));

    return (
        <>
            <RichContent html={cmsPageBannerBlock.content} classes={{ root: classes.cmsPageBanner }} />
            <div className={classes.menuRoot}>{pageButtons}</div>
        </>
    );
};

CmsMenu.propTypes = {
    identifier: string
};

export default CmsMenu;
