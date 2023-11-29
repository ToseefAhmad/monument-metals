import { bool, func } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import Popup from 'reactjs-popup';

import ForgotPassword from '@app/components/overrides/ForgotPassword';
import { POPUP_CONFIG } from '@app/util/popup';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './forgotPasswordPopup.module.css';

const ForgotPasswordPopup = ({ isPopupOpen, onPopupClose }) => {
    return (
        <div className={classes.root}>
            <Popup open={isPopupOpen} {...POPUP_CONFIG} onClose={onPopupClose}>
                <div className={classes.modal}>
                    <div className={classes.closeIcon}>
                        <button onClick={onPopupClose}>
                            <Icon src={CloseIcon} size={32} />
                        </button>
                    </div>
                    <ForgotPassword onCancel={onPopupClose} />
                </div>
            </Popup>
        </div>
    );
};

ForgotPasswordPopup.propTypes = {
    isPopupOpen: bool,
    onPopupClose: func.isRequired
};

export default ForgotPasswordPopup;
