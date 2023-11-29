import classnames from 'classnames';
import { bool, string, func, object } from 'prop-types';
import React from 'react';

import Button from '../../components/overrides/Button';
import Icon from '../../components/overrides/Icon';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './toggleViewButton.module.css';

const ToggleViewButton = props => {
    const { changeView, icon, onPress } = props;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div>
            <Button
                disabled={changeView}
                onClick={onPress}
                classes={{
                    root_normalPriority: classnames({
                        [classes.listButton]: changeView,
                        [classes.gridButton]: !changeView
                    })
                }}
                priority="normal"
            >
                <Icon
                    src={icon}
                    classes={{
                        icon: classnames({
                            [classes.darkerIcon]: !changeView,
                            [classes.lightIcon]: changeView
                        })
                    }}
                />
            </Button>
        </div>
    );
};

ToggleViewButton.propTypes = {
    classes: string,
    changeView: bool,
    icon: object,
    onPress: func
};
export default ToggleViewButton;
