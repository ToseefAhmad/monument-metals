import classnames from 'classnames';
import { object, array, bool } from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';

import { ArrowLargeRight, ArrowLargeLeft } from '@app/components/MonumentIcons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AriaButton from '@magento/venia-ui/lib/components/AriaButton';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './priceBar.module.css';
import PriceEntry from './priceEntry';

const PriceSlider = props => {
    const { entries, hasNotification } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const [visiblePriceIndex, setVisiblePriceIndex] = useState(0);

    const slidesToShow = visiblePriceIndex === 0 ? 2 : 1;
    const slidesToScroll = visiblePriceIndex === 0 ? 2 : 1;

    const showPrevPriceBlock = () => {
        if (visiblePriceIndex <= 0) {
            setVisiblePriceIndex(entries.length - 1);
        } else {
            setVisiblePriceIndex(current => current - (current === 2 ? 2 : 1));
        }
    };

    const showNextPriceBlock = () => {
        if (visiblePriceIndex >= entries.length - slidesToScroll) {
            setVisiblePriceIndex(0);
        } else {
            setVisiblePriceIndex(current => current + slidesToScroll);
        }
    };

    const previousButton = formatMessage({
        id: 'priceSlider.previousButtonAriaLabel',
        defaultMessage: 'Previous metal price'
    });

    const nextButton = formatMessage({
        id: 'priceSlider.nextButtonAriaLabel',
        defaultMessage: 'Next metal price'
    });

    let touchXStart = 0;

    const handleTouchStart = e => {
        touchXStart = e.touches && e.touches[0] && e.touches[0].screenX ? e.touches[0].screenX : null;
    };

    const handleTouchEnd = e => {
        const touchXEnd =
            e.changedTouches && e.changedTouches[0] && e.changedTouches[0].screenX ? e.changedTouches[0].screenX : null;
        if (touchXStart && touchXEnd && touchXStart > touchXEnd) {
            showPrevPriceBlock();
        } else if (touchXStart && touchXEnd && touchXStart < touchXEnd) {
            showNextPriceBlock();
        }
    };

    const metals = entries.map((item, index) => {
        const entryClass =
            index == visiblePriceIndex || index == visiblePriceIndex + slidesToShow - 1
                ? classes.visibleEntry
                : classes.hiddenEntry;

        return (
            <Fragment key={item.identifier}>
                <div
                    key={item.identifier}
                    className={entryClass}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <PriceEntry key={item.identifier} {...item} />
                </div>
            </Fragment>
        );
    });

    return (
        <div
            className={classnames({
                [classes.mobileRoot]: true,
                [classes.mobileNotification]: hasNotification
            })}
        >
            <AriaButton
                onPress={showPrevPriceBlock}
                aria-label={previousButton}
                type="button"
                className={classes.arrowButton}
            >
                <Icon src={ArrowLargeLeft} size={17} attrs={{ stroke: '#111927', fill: '#111927' }} />
            </AriaButton>
            {metals}
            <AriaButton
                onPress={showNextPriceBlock}
                aria-label={nextButton}
                type="button"
                className={classes.arrowButton}
            >
                <Icon src={ArrowLargeRight} size={17} attrs={{ stroke: '#111927', fill: '#111927' }} />
            </AriaButton>
        </div>
    );
};

PriceSlider.propTypes = {
    classes: object,
    hasNotification: bool,
    entries: array
};

export default PriceSlider;
