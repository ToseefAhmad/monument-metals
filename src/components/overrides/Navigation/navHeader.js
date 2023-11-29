import { bool, func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { X as CloseIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { ArrowLeft } from '@app/components/MonumentIcons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import defaultClasses from './navHeader.module.css';
import { useNavigationHeader } from './useNavigationHeader';

const NavHeader = props => {
    const { onBack, view, onClose: handleClose, isTopLevel, currentCategoryTitle } = props;
    const { formatMessage } = useIntl();

    const talonProps = useNavigationHeader({
        onBack
    });

    const { handleBack } = talonProps;
    const handleCloseForAccountSection = () => {
        handleBack();
        handleClose();
    };

    const classes = useStyle(defaultClasses, props.classes);
    const titles = {
        CREATE_ACCOUNT: formatMessage({
            id: 'navHeader.createAccountText',
            defaultMessage: 'Register'
        }),
        FORGOT_PASSWORD: formatMessage({
            id: 'navHeader.forgotPasswordText',
            defaultMessage: 'Forgot Password'
        }),
        MY_ACCOUNT: formatMessage({
            id: 'navHeader.myAccountText',
            defaultMessage: 'My Account'
        }),
        SIGN_IN: formatMessage({
            id: 'navHeader.signInText',
            defaultMessage: 'Sign In'
        }),
        MENU: formatMessage({
            id: 'navHeader.mainMenuText',
            defaultMessage: 'Menu'
        })
    };

    let titleElement;
    if (['MY_ACCOUNT', 'SIGN_IN'].includes(view)) {
        titleElement = ['MY_ACCOUNT'].includes(view) ? 'Profile Menu' : 'Login';
    } else if ('MENU' === view) {
        // If we on top of category tree, root category title will be Menu default title
        const title = currentCategoryTitle === 'root' ? titles.MENU : currentCategoryTitle;
        titleElement = <span>{title}</span>;
    } else {
        const title = titles[view] || titles.MENU;
        titleElement = <span>{title}</span>;
    }

    const isBackButton = (!isTopLevel && view === 'MENU') || view === 'MY_ACCOUNT';

    return (
        <Fragment>
            {isBackButton && (
                <Trigger classes={{ root: classes.backTrigger }} key="backButton" action={handleBack}>
                    <Icon classes={{ root: classes.backTriggerIcon }} src={ArrowLeft} />
                </Trigger>
            )}

            <span key="title" className={classes.title}>
                {titleElement}
            </span>
            <button
                className={classes.closeTrigger}
                key="closeButton"
                onClick={view === 'MENU' ? handleClose : handleCloseForAccountSection}
            >
                <Icon
                    size={32}
                    classes={{
                        root: classes.closeTriggerIcon
                    }}
                    src={CloseIcon}
                />
            </button>
        </Fragment>
    );
};

export default NavHeader;

NavHeader.propTypes = {
    classes: shape({
        title: string
    }),
    onBack: func.isRequired,
    onClose: func.isRequired,
    view: string.isRequired,
    isTopLevel: bool.isRequired,
    currentCategoryTitle: string.isRequired
};
