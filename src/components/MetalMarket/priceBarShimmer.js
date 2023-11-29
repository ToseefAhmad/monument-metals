import classnames from 'classnames';
import { bool } from 'prop-types';
import React from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './priceBar.module.css';

const PriceBarShimmer = ({ hasNotification }) => {
    const classes = useStyle(defaultClasses);
    const { isDesktopScreen } = useScreenSize();

    if (isDesktopScreen) {
        const shimmers = Array.from({ length: 4 }).map((empty, index) => (
            <div key={`metal-shimmer__${index}`} className={classes.priceEntry}>
                <Shimmer width={'60%'} height={2} />
            </div>
        ));

        return (
            <div
                className={classnames({
                    [classes.priceContainer]: true,
                    [classes.notification]: hasNotification
                })}
            >
                {shimmers}
            </div>
        );
    }

    const shimmers = Array.from({ length: 2 }).map((empty, index) => (
        <div key={`metal-shimmer__${index}`} className={classes.singleShimmer}>
            <Shimmer width={'60%'} height={1.5} />
        </div>
    ));

    return (
        <div
            className={classnames({
                [classes.mobileRoot]: true,
                [classes.mobileNotification]: hasNotification
            })}
        >
            {shimmers}
        </div>
    );
};

PriceBarShimmer.propTypes = {
    hasNotification: bool
};

export default PriceBarShimmer;
