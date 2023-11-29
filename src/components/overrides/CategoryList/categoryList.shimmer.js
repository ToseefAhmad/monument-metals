import { string } from 'prop-types';
import React from 'react';

import classes from './categoryList.module.css';
import CategoryTileShimmer from './categoryTile.shimmer';

const CategoryListShimmer = ({ count }) => {
    const tiles = Array.from({ length: count }).fill(null);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.content}>
                {tiles.map((tile, index) => (
                    <CategoryTileShimmer key={index} />
                ))}
            </div>
        </div>
    );
};

CategoryListShimmer.propTypes = {
    count: string
};

export default CategoryListShimmer;
