import { array, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './trackingDetails.module.css';

const TrackingDetails = props => {
    const { data, classes: propsClasses } = props;
    const { shipments } = data;

    const classes = useStyle(defaultClasses, propsClasses);
    let trackingElement;

    if (shipments.length) {
        trackingElement = shipments.map(shipment => {
            const { tracking: trackingCollection } = shipment;
            if (trackingCollection.length) {
                return trackingCollection.map(tracking => {
                    const { number } = tracking;

                    return (
                        <span className={classes.trackingRow} key={number}>
                            {number}
                        </span>
                    );
                });
            }
        });
    } else {
        trackingElement = (
            <FormattedMessage id="orderDetails.waitingOnTracking" defaultMessage="Waiting for tracking information" />
        );
    }

    return <span className={classes.root}>{trackingElement}</span>;
};
export default TrackingDetails;

TrackingDetails.propTypes = {
    classes: shape({
        root: string
    }),
    data: array
};
