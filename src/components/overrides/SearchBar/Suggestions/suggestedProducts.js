import classnames from 'classnames';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductCard from '@app/components/overrides/ProductCard';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import defaultClasses from './suggestedProducts.module.css';

const SuggestedProducts = props => {
    const { limit, onNavigate, products, queryText, pageSize, setPageSize, resultCount, closeSearchBar } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const items = products.map(product => (
        <li key={product.id} className={classes.item}>
            <ProductCard
                {...mapProduct(product)}
                classes={{ ...classes, root: classes.productCardRoot }}
                onNavigate={onNavigate}
                onClick={closeSearchBar}
                onKeyDown={onNavigate}
            />
        </li>
    ));

    const { isMobileScreen } = useScreenSize();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headingDesktop}>
                    <FormattedMessage id={'searchBar.headingDesktop'} defaultMessage={'Products'} />
                </p>
                <p className={classes.headingMobile}>
                    <FormattedMessage id={'searchBar.headingMobile'} defaultMessage={'Product Suggestions'} />
                </p>
            </div>
            <ul className={classnames({ [classes.products]: true, [classes.productsEmpty]: !items.length })}>
                {items}
            </ul>
            {products.length < resultCount && (
                <div>
                    <button
                        type="button"
                        onClick={() => setPageSize(pageSize + limit)}
                        className={classes.searchButton}
                    >
                        {isMobileScreen ? (
                            <FormattedMessage id="suggestedProducts.searchButtonTextMobile" defaultMessage="See More" />
                        ) : (
                            <FormattedMessage
                                id="suggestedProducts.searchButtonTextDesktop"
                                defaultMessage='See more results for "{queryText}"'
                                values={{
                                    queryText
                                }}
                            />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

SuggestedProducts.defaultProps = {
    limit: 4
};

SuggestedProducts.propTypes = {
    classes: shape({
        item: string,
        root: string
    }),
    limit: number.isRequired,
    onNavigate: func,
    products: arrayOf(
        shape({
            id: oneOfType([number, string]).isRequired
        })
    ).isRequired,
    queryText: string.isRequired,
    pageSize: number.isRequired,
    setPageSize: func.isRequired,
    resultCount: number.isRequired,
    closeSearchBar: func.isRequired
};

export default SuggestedProducts;
