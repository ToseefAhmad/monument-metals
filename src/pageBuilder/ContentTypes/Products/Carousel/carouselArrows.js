import { func, oneOf } from 'prop-types';
import React from 'react';

import { ArrowRight, ArrowLeft } from '@app/components/MonumentIcons';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './carouselArrows.module.css';

const CarouselArrow = ({ onClick, arrow }) => {
    const isArrowNext = arrow === 'next';

    const arrowClass = isArrowNext ? classes.arrowButtonNextWrapper : classes.arrowButtonPrevWrapper;
    const arrowIcon = isArrowNext ? <Icon src={ArrowRight} /> : <Icon src={ArrowLeft} />;

    return (
        <div className={arrowClass}>
            <Button onClick={onClick} priority="low" classes={{ root_lowPriority: classes.arrowButton }}>
                {arrowIcon}
            </Button>
        </div>
    );
};

CarouselArrow.defaultProps = {
    arrow: 'next'
};

CarouselArrow.propTypes = {
    onClick: func,
    arrow: oneOf(['next', 'prev'])
};

export default CarouselArrow;
