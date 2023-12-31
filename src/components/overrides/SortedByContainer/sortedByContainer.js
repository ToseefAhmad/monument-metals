import PropTypes, { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './sortedByContainer.module.css';

const SortedByContainer = props => {
    const { currentSort } = props;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <FormattedMessage id={'searchPage.sortContainer'} defaultMessage={'Items sorted by '} />
            <span className={classes.sortText}>
                <FormattedMessage id={currentSort.sortId} defaultMessage={currentSort.sortText} />
            </span>
        </div>
    );
};

export default SortedByContainer;

SortedByContainer.propTypes = {
    shouldDisplay: PropTypes.bool,
    currentSort: PropTypes.shape({
        sortId: PropTypes.string,
        sortText: PropTypes.string
    }),
    classes: shape({
        root: string
    })
};
