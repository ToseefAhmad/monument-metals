import { bool, shape, string, node } from 'prop-types';
import React from 'react';

import { DEFAULT_ERROR_PAGE_TITLE } from '@app/components/overrides/ErrorView/errorView';
import Footer from '@app/components/overrides/Footer';
import Header from '@app/components/overrides/Header';
import Newsletter from '@app/components/overrides/Newsletter';
import ProductAddedModal from '@app/components/ProductAddedModal/productAddedModal';
import { useScrollLock } from '@magento/peregrine';

import classes from './main.module.css';

const Main = props => {
    const { children, isMasked } = props;

    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;
    const errorPageClass = isMasked ? classes.page_masked : classes.errorPage;
    const isErrorPage = document.title === `${DEFAULT_ERROR_PAGE_TITLE} - Monument Metals`;

    const pageStyling = isErrorPage ? errorPageClass : pageClass;

    useScrollLock(isMasked);

    return (
        <>
            <main className={rootClass}>
                <Header />
                <div className={pageStyling + ' main-page'}>
                    {children}
                    <Newsletter />
                </div>
                <Footer />
            </main>
            <ProductAddedModal />
        </>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool,
    children: node
};
