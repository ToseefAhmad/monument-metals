import { number, string, shape } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import patches from '@magento/peregrine/lib/util/intlPatches';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './price.module.css';

/**
 * The **Price** component is used anywhere a price needs to be displayed.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */

const Price = ({ value, currencyCode, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { locale } = useIntl();

    const parts = patches.toParts.call(
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode
        }),
        value
    );

    const children = parts.map((part, i) => {
        const partClass = classes[part.type];
        const key = `${i}-${part.value}`;

        return (
            <span key={key} className={partClass}>
                {part.value}
            </span>
        );
    });

    return <Fragment>{children}</Fragment>;
};

Price.propTypes = {
    /**
     * Class names to use when styling this component
     */
    classes: shape({
        currency: string,
        integer: string,
        decimal: string,
        fraction: string
    }),
    /**
     * The numeric price
     */
    value: number.isRequired,
    /**
     * A string with any of the currency code supported by Intl.NumberFormat
     */
    currencyCode: string.isRequired
};

Price.defaultProps = {
    classes: {}
};

export default Price;
