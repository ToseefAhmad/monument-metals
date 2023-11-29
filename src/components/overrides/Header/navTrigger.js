import { node, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Hamburger as HamburgerIcon } from '@app/components/MonumentIcons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './navTrigger.module.css';
import { useNavigationTrigger } from './useNavigationTrigger';

/**
 * A component that toggles the navigation menu.
 */
const NavigationTrigger = props => {
    const { formatMessage } = useIntl();
    const { handleOpenNavigation } = useNavigationTrigger();

    const classes = useStyle(defaultClasses, props.classes);
    return (
        <button
            className={classes.root}
            aria-label={formatMessage({
                id: 'navigationTrigger.ariaLabel',
                defaultMessage: 'Toggle navigation panel'
            })}
            onClick={handleOpenNavigation}
        >
            <Icon src={HamburgerIcon} />
        </button>
    );
};

NavigationTrigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    })
};

export default NavigationTrigger;
