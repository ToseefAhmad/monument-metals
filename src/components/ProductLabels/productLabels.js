/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { useAmProductLabelContext } from './context';
import Label from './Label/label';
import defaultClasses from './productLabels.module.css';
import { toCamelCase } from './utils';

/**
 * @typedef ProductLabels
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element}
 */

const LABEL_ALIGNMENT = {
    0: 'vertical',
    1: 'horizontal'
};

const LabelGroup = ({ items, dimensions, marginBetween, labelsAlignment }) =>
    items.map((label, index) => {
        const settingStyle = {
            [`margin${labelsAlignment === 1 ? 'Left' : 'Top'}`]: index !== 0 ? marginBetween : 0
        };
        return <Label item={label} key={index} dimensions={dimensions} settingStyle={settingStyle} />;
    });

const ProductLabels = props => {
    const { itemId, productWidth } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const windowSize = useWindowSize();
    const { labels, mode, labelSetting } = useAmProductLabelContext() || {};

    const targetRef = useRef();
    const rootWidth = targetRef?.current?.offsetWidth;

    const [dimensions, setDimensions] = useState({
        width: productWidth
    });

    const setLabelDynamicStyles = useCallback(() => {
        if (rootWidth) {
            setDimensions({
                width: rootWidth
            });
        }
    }, [setDimensions, rootWidth]);

    useEffect(setLabelDynamicStyles, [setLabelDynamicStyles, windowSize]);

    if (!labels) {
        return null;
    }

    const { items } = mode === 'PRODUCT' ? labels : labels[itemId] || {};

    if (!items || !items.length) {
        return null;
    }

    const groupedLabels = items.reduce((acc, curr) => {
        if (!acc[curr.position]) {
            acc[curr.position] = [];
        }
        acc[curr.position].push(curr);

        return acc;
    }, {});

    const labelsContent = Object.keys(groupedLabels).map(group => {
        const { labels_alignment: labelsAlignment, margin_between: marginBetween } = labelSetting || {};
        const alignClass = LABEL_ALIGNMENT[labelsAlignment] || LABEL_ALIGNMENT[0];
        const groupClasses = `${classes.groupRoot} ${classes[toCamelCase(group)]} ${classes[alignClass]}`;

        return (
            <div className={groupClasses} key={group}>
                <LabelGroup
                    items={groupedLabels[group]}
                    dimensions={dimensions}
                    marginBetween={marginBetween}
                    labelsAlignment={labelsAlignment}
                />
            </div>
        );
    });

    return (
        <div className={classes.root} ref={targetRef}>
            {labelsContent}
        </div>
    );
};

/**
 * Props for {@link ProductLabels}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the AmProductLabels component.
 */
ProductLabels.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string
    }),
    itemId: PropTypes.number,
    mode: PropTypes.string,
    productWidth: PropTypes.number
};

export default ProductLabels;
