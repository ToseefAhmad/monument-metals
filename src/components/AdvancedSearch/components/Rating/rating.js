import { number } from 'prop-types';
import React from 'react';

import classes from './rating.module.css';

const Rating = props => {
    const { count, percent, value } = props;

    return (
        <article className={classes.root}>
            <p className={classes.stars} title={`${value} ${value > 1 ? 'stars' : 'star'}`}>
                <span style={{ width: `${percent}%` }} className={classes.starsFilled} />
            </p>
            <span className={classes.count}>
                {count} {'reviews'}
            </span>
        </article>
    );
};

Rating.propTypes = {
    percent: number,
    count: number,
    value: number
};

export default Rating;
