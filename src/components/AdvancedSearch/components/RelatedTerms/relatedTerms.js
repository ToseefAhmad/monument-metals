import { number } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { URLS } from '../../constants';
import { useRelatedTerms } from '../../talons/useRelatedTerms';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './relatedTerms.module.css';

const RelatedTerms = props => {
    const { productsQty } = props;

    if (!productsQty) {
        return null;
    }

    const classes = mergeClasses(defaultClasses);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isEnabled, items, isCountShowing } = useRelatedTerms({
        productsQty: productsQty
    });

    if (!isEnabled) {
        return null;
    }

    const list = items.map((item, index) => (
        <li key={item.name + index} className={classes.item}>
            <Link className={classes.link} to={resourceUrl(`${URLS.SEARCHURLPARAMS}${item.name}`)}>
                {item.name}
                {isCountShowing && <span className={classes.count}>{item.count}</span>}
            </Link>
        </li>
    ));

    return (
        <div className={classes.root}>
            <h4 className={classes.head}>{'Related search terms'}</h4>
            <ul className={classes.list}>{list}</ul>
        </div>
    );
};

RelatedTerms.propTypes = {
    productsQty: number
};

export default RelatedTerms;
