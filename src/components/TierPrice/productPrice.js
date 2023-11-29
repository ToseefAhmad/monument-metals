import classnames from 'classnames';
import { array, string, shape, object } from 'prop-types';
import React, { useMemo } from 'react';

import Price from '@magento/venia-ui/lib/components/Price';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

import classes from './priceBlock.module.css';

const ProductPrice = ({ tierPrices, mainPrice, shortDescription }) => {
    const mainQty = tierPrices.length > 0 ? '1 - ' + (tierPrices[0].quantity - 1) : '1+';

    const main = (
        <tr className={classes.row}>
            <td>{mainQty}</td>
            <td className={classes.price}>
                <Price value={mainPrice.final_price.value} currencyCode={mainPrice.final_price.currency} />
            </td>
            <td className={classes.price}>
                <Price value={mainPrice.fee_price.value} currencyCode={mainPrice.fee_price.currency} />
            </td>
        </tr>
    );

    const tier = useMemo(() => {
        if (tierPrices.length > 0) {
            return tierPrices.map((tierPrice, index, array) => {
                const tierQty =
                    array.length - 1 > index
                        ? tierPrice.quantity + ' - ' + (array[index + 1].quantity - 1)
                        : tierPrice.quantity + '+';

                return (
                    <tr className={classes.row} key={index}>
                        <td>{tierQty}</td>
                        <td className={classes.price}>
                            <Price value={tierPrice.final_price.value} currencyCode={tierPrice.final_price.currency} />
                        </td>
                        <td className={classes.price}>
                            <Price value={tierPrice.fee_price.value} currencyCode={tierPrice.fee_price.currency} />
                        </td>
                    </tr>
                );
            });
        }
    }, [tierPrices]);

    const description =
        shortDescription && shortDescription.html ? (
            <tr className={classnames(classes.row, classes.description)}>
                <td colSpan="3">
                    <RichContent html={shortDescription.html} />
                </td>
            </tr>
        ) : null;

    return (
        <div className={classes.container}>
            <table className={classes.table}>
                <thead className={classes.thead}>
                    <tr className={classes.row}>
                        <th className={classes.headText}>Quantity</th>
                        <th className={classes.headText}>(e)Check/Wire</th>
                        <th className={classes.headText}>CC/PayPal</th>
                    </tr>
                </thead>
                <tbody className={classes.tbody}>
                    {main}
                    {tier}
                    {description}
                </tbody>
            </table>
        </div>
    );
};

/**
 * Props for {@link ProductPrice}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the ProductPrice component.
 */
ProductPrice.propTypes = {
    tierPrices: array,
    mainPrice: object,
    shortDescription: shape({
        html: string
    })
};

export default ProductPrice;
