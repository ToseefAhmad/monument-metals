import { node } from 'prop-types';
import React from 'react';

import CheckoutProvider from '@app/components/CheckoutPage/context';
import Footer from '@app/components/CheckoutPage/Footer';
import Header from '@app/components/CheckoutPage/Header';

import classes from './checkoutLayout.module.css';

const CheckoutLayout = ({ children }) => {
    return (
        <CheckoutProvider>
            <Header />
            <main className={classes.main}>{children}</main>
            <Footer />
        </CheckoutProvider>
    );
};

CheckoutLayout.propTypes = {
    children: node
};

export default CheckoutLayout;
