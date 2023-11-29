import { useFieldState } from 'informed';
import { debounce } from 'lodash';
import { func, number } from 'prop-types';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAmXsearchContext } from '../../context';
import { useProducts } from '../../talons/useProducts';

import { useScreenSize } from '@app/hooks/useScreenSize';

import Product from './product';
import classes from './productsBlock.module.css';

const ProductsBlock = props => {
    const { position, closeSearchBar } = props;
    const [inputText, setInputText] = useState('');
    const { value } = useFieldState('search_query');
    const { storeConfig } = useAmXsearchContext();

    const updateInputText = useCallback(setInputText, [setInputText]);
    const debounced = useMemo(() => debounce(updateInputText, 150), [updateInputText]);

    const { amasty_xsearch_product_title, amasty_xsearch_product_limit: limit } = storeConfig;

    const { isProductsShowed, items, loading, total_count, viewAllUrl } = useProducts({
        inputText
    });

    useEffect(() => {
        debounced(value + '');

        return () => {
            debounced.cancel();
        };
    }, [debounced, value]);

    const { isMobileScreen } = useScreenSize();

    const message = (
        <span className={classes.message} style={{ order: position }}>
            {'Your search returned no products.'}
        </span>
    );

    const loadingMessage = (
        <span className={classes.message} style={{ order: position }}>
            {'Searching...'}
        </span>
    );

    const list = useMemo(
        () =>
            isProductsShowed &&
            items.slice(0, limit).map(item => <Product closeSearchBar={closeSearchBar} key={item.id} product={item} />),
        [isProductsShowed, items, limit, closeSearchBar]
    );

    if (loading) {
        return loadingMessage;
    }

    if (!isProductsShowed) {
        return message;
    }

    return (
        <Fragment>
            <div className={classes.root} style={{ order: position }}>
                <h4 className={classes.head}>{amasty_xsearch_product_title}</h4>
                <ul className={classes.items}>{list}</ul>
                {total_count > limit && (
                    <Link onClick={closeSearchBar} to={viewAllUrl}>
                        <button className={classes.viewAll}>
                            {isMobileScreen ? `See more` : `See more results for "${value}"`}
                        </button>
                    </Link>
                )}
            </div>
        </Fragment>
    );
};

export default ProductsBlock;

ProductsBlock.propTypes = {
    position: number,
    closeSearchBar: func.isRequired
};
