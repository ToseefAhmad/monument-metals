import { object, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Popup from 'reactjs-popup';

import Shimmer from '@app/components/overrides/Shimmer';
import { useCountdown } from '@app/components/PriceFreeze/useCountdown';
import { POPUP_CONFIG_FORCE } from '@app/util/popup';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './countdown.module.css';

const Countdown = ({ isDuplicate, classes: propClasses }) => {
    const {
        isLoaded,
        isPaymentLoading,
        isPlacingOrder,
        isAfterPlacingOrder,
        popupRef,
        shouldShowPopup,
        minutes,
        seconds,
        handleConfirm
    } = useCountdown({ isDuplicate });

    const classes = useStyle(defaultClasses, propClasses);

    if (!isLoaded) {
        return (
            <div className={classes.shimmer}>
                <div className={classes.shimmerContent}>
                    <Shimmer width="100%" height="100%" />
                </div>
            </div>
        );
    }

    if (shouldShowPopup && (isPaymentLoading || isPlacingOrder || isAfterPlacingOrder)) {
        return null;
    }

    let popup;
    if (shouldShowPopup) {
        popup = (
            <Popup ref={popupRef} {...POPUP_CONFIG_FORCE}>
                <div className={classes.modal}>
                    <div className={classes.content}>
                        <p className={classes.freeze}>
                            <FormattedMessage
                                id="priceFreeze.refreshText"
                                defaultMessage="Price freeze has expired, pricing will be updated"
                            />
                        </p>
                    </div>
                    <div className={classes.actions}>
                        <Button priority="normal" onClick={handleConfirm}>
                            <FormattedMessage id="priceFreeze.popupConfirm" defaultMessage="Confirm" />
                        </Button>
                    </div>
                </div>
            </Popup>
        );
    }

    return (
        <>
            <div className={classes.root}>
                <p className={classes.text}>
                    <FormattedMessage id="priceFreeze.pricingLocked" defaultMessage="Your pricing is locked for:" />{' '}
                    <span className={classes.time}>
                        {minutes}:{seconds}
                    </span>
                </p>
            </div>
            {popup}
        </>
    );
};

Countdown.defaultProps = {
    isDuplicate: false
};

Countdown.propTypes = {
    classes: object,
    isDuplicate: bool
};

export default Countdown;
