import { shape, arrayOf, number } from 'prop-types';
import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './shippingInformation.module.css';

const ShippingInformationShimmer = ({ preloadedCustomerAddresses }) => {
    const content = preloadedCustomerAddresses.length ? (
        <div aria-live="polite" aria-busy="true">
            <div className={classes.shimmer}>
                {preloadedCustomerAddresses.map(address => (
                    <div className={classes.shimmerContainer} key={address.id}>
                        <Shimmer width="100%" height="100%" borderRadius="3px" />
                    </div>
                ))}
            </div>
            <div className={classes.shimmerButtonContainer}>
                <Shimmer width="100%" />
            </div>
        </div>
    ) : (
        <div aria-live="polite" aria-busy="true">
            <div className={classes.shimmerForm}>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="100px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="74px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="73px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="59px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="100px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="33px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="100px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="106px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="58px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
                <div className={classes.shimmerField}>
                    <div className={classes.shimmerLabel}>
                        <Shimmer width="100px" height="21px" />
                    </div>
                    <Shimmer type="textInput" />
                </div>
            </div>
        </div>
    );

    return <>{content}</>;
};

ShippingInformationShimmer.propTypes = {
    preloadedCustomerAddresses: arrayOf(
        shape({
            id: number
        })
    )
};

export default ShippingInformationShimmer;
