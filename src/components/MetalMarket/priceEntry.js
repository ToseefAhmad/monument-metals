import classnames from 'classnames';
import { string } from 'prop-types';
import React from 'react';

import { PriceDown, PriceUp } from '@app/components/MonumentIcons';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './priceBar.module.css';

const PriceEntry = ({ identifier, ask, change }) => {
    const askPrice = Number(ask).toFixed(2);
    const changeAbs = Math.abs(change).toFixed(2);
    const changeBlock =
        change > 0 ? (
            <span className={classnames(classes.change, classes.green)}>
                <Icon src={PriceUp} classes={{ root: classes.icon }} />$ + {changeAbs}
            </span>
        ) : (
            <span className={classnames(classes.change, classes.red)}>
                <Icon src={PriceDown} classes={{ root: classes.icon }} />$ - {changeAbs}
            </span>
        );

    return (
        <div className={classes.priceEntry}>
            <span className={classes.label}>{identifier}:</span>
            <span className={classes.askPrice}>$ {askPrice}</span>
            {changeBlock}
        </div>
    );
};

PriceEntry.propTypes = {
    identifier: string,
    ask: string,
    change: string
};

export default PriceEntry;
