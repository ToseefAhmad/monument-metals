import { array, shape, string, object } from 'prop-types';
import React, { useMemo } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './priceBlockSmall.module.css';

const ProductPriceSmall = props => {
    const { tierPrices, mainPrice } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const mainQty = tierPrices.length > 0 ? '1 - ' + (tierPrices[0].quantity - 1) : '1+';

    const main = (
        <tr>
            <td className={classes.tableQuantity}>{mainQty}</td>
            <td className={classes.tablePrice}>
                <Price value={mainPrice.final_price.value} currencyCode={mainPrice.final_price.currency} />
            </td>
        </tr>
    );

    const tier = useMemo(() => {
        return tierPrices.map((price, index, array) => {
            const tierQty =
                array.length - 1 > index
                    ? price.quantity + ' - ' + (array[index + 1].quantity - 1)
                    : price.quantity + '+';

            return (
                <tr key={index}>
                    <td className={classes.tableQuantity}>{tierQty}</td>
                    <td className={classes.tablePrice}>
                        <Price value={price.final_price.value} currencyCode={price.final_price.currency} />
                    </td>
                </tr>
            );
        });
    }, [classes.tablePrice, classes.tableQuantity, tierPrices]);

    return (
        <table className={classes.table}>
            <thead>
                <tr>
                    <th className={classes.tableTitleLeft}>Quantity</th>
                    <th className={classes.tableTitleRight}>Check/Wire</th>
                </tr>
            </thead>

            <tbody>
                {main}
                {tier}
            </tbody>
        </table>
    );
};

/**
 * Props for {@link ProductPriceSmall}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the ProductPriceSmall component.
 */
ProductPriceSmall.propTypes = {
    tierPrices: array,
    mainPrice: object,
    classes: shape({
        table: string,
        tableTitle: string,
        tableTitleLeft: string,
        tableTitleRight: string,
        tableQuantity: string,
        tablePrice: string
    })
};

export default ProductPriceSmall;
