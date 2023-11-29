import { object } from 'prop-types';
import React, { Fragment } from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './category.module.css';

const CategoryTitle = ({ data }) => {
    const categoryName = data ? data.category.name : null;
    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;

    return (
        <Fragment>
            <div>
                <div className={classes.categoryHeader}>
                    <h1 className={classes.title}>{categoryTitle}</h1>
                </div>
            </div>
        </Fragment>
    );
};

CategoryTitle.propTypes = {
    data: object
};

export default CategoryTitle;
