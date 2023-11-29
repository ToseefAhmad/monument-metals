import { arrayOf, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { CheckMark as Check } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';
import { useOrderProgressBar } from '@app/components/overrides/OrderHistoryPage/useOrderProgressBar';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderProgressBar.module.css';

const OrderProgressBar = props => {
    const { status, paymentMethods, statusHistory } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { mappedStatus, statusStepMap, history } = useOrderProgressBar({ status, paymentMethods, statusHistory });

    const currentStep = statusStepMap.findIndex(st => st === mappedStatus);

    const stepElements = useMemo(() => {
        const checkmarkIcon = <Icon classes={{ root: classes.checkMarkIcon }} src={Check} size={20} />;
        return statusStepMap.map((value, key) => {
            const isStepComplete = key <= currentStep;
            const stepClass = isStepComplete ? classes.step_completed : classes.step;
            const createdAt = history.find(h => {
                return h.status === value || (isStepComplete ? h.status === statusStepMap[key + 1] : null);
            })?.timestamp;

            return (
                <div key={value} className={classes.statusItem}>
                    <div className={stepClass}> {checkmarkIcon}</div>
                    <div className={classes.textWrapper}>
                        <span className={classes.statusLabel}>{value}</span>
                        {isStepComplete && <span>{createdAt}</span>}
                    </div>
                </div>
            );
        });
    }, [
        classes.checkMarkIcon,
        classes.statusItem,
        classes.statusLabel,
        classes.step,
        classes.step_completed,
        classes.textWrapper,
        currentStep,
        history,
        statusStepMap
    ]);

    return <div className={classes.root}>{stepElements}</div>;
};

export default OrderProgressBar;

OrderProgressBar.propTypes = {
    classes: shape({
        root: string,
        step: string,
        step_completed: string
    }),
    status: string.isRequired,
    paymentMethods: arrayOf(
        shape({
            name: string,
            type: string
        })
    ),
    statusHistory: arrayOf(
        shape({
            status: string,
            timestamp: string
        })
    )
};
