import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';

import defaultClasses from './footer.module.css';

const Footer = props => {
    const classes = useStyle(props.classes, defaultClasses);

    return (
        <footer className={classes.root}>
            <CmsBlock identifiers={'footer'} />
        </footer>
    );
};

export default Footer;

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
