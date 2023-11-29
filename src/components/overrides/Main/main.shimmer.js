import { shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import HeaderShimmer from '@app/components/overrides/Header/header.shimmer';
import CmsShimmer from '@app/RootComponents/CMS/cms.shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './main.module.css';

const MainShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const headerShimmer = useMemo(() => <HeaderShimmer />, []);

    const isErrorPage = document.title === 'Page Not Found - Monument Metals';

    const pageStyling = isErrorPage ? classes.errorPage : classes.page;

    return (
        <main className={classes.root}>
            {headerShimmer}
            <div className={pageStyling + ' main-page'}>
                <CmsShimmer />
            </div>
        </main>
    );
};

MainShimmer.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    })
};

export default MainShimmer;
