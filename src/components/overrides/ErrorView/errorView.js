import { func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory, Link } from 'react-router-dom';

import { StoreTitle } from '@app/components/overrides/Head';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './errorView.module.css';

const NotFound = React.lazy(() => import('@app/components/MonumentIcons/icons/not-found'));

const DEFAULT_HEADER = 'Page not found...';
const DEFAULT_MESSAGE = 'Looks like something went wrong. Sorry about that.';
const DEFAULT_PROMPT = 'Take me home';
const DEFAULT_CONTACT_US = 'contact us';
const DEFAULT_BREADCRUMB = '404';

export const DEFAULT_ERROR_PAGE_TITLE = 'Page Not Found';

const ErrorView = props => {
    const history = useHistory();

    const handleGoHome = useCallback(() => {
        history.push('/');
    }, [history]);

    const {
        header = <FormattedMessage id={'errorView.header'} defaultMessage={DEFAULT_HEADER} />,
        buttonPrompt = <FormattedMessage id={'errorView.goHome'} defaultMessage={DEFAULT_PROMPT} />,
        onClick = handleGoHome
    } = props;

    const contactUs = <FormattedMessage id={'errorView.contactUs'} defaultMessage={DEFAULT_CONTACT_US} />;

    const contactLink = (
        <Link className={classes.link} to="/contact-us">
            {contactUs}
        </Link>
    );

    const message = (
        <FormattedMessage id={'errorView.message'} defaultMessage={DEFAULT_MESSAGE} values={{ contactLink }} />
    );

    const handleClick = useCallback(() => {
        onClick && onClick();
    }, [onClick]);

    return (
        <>
            <StoreTitle>{DEFAULT_ERROR_PAGE_TITLE}</StoreTitle>
            <div className={classes.container}>
                <Breadcrumbs staticPage={DEFAULT_BREADCRUMB} />
                <div className={classes.root}>
                    <div className={classes.content}>
                        <div className={classes.iconContainer}>
                            <Icon src={NotFound} classes={{ root: classes.icon }} />
                        </div>
                        <div className={classes.textContainer}>
                            <h1 className={classes.header}>{header}</h1>
                            <p className={classes.message}>{message}</p>
                            <div className={classes.buttonContainer}>
                                <Button priority="normal" type="button" onClick={handleClick}>
                                    {buttonPrompt}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ErrorView.propTypes = {
    header: string,
    message: string,
    buttonPrompt: string,
    onClick: func,
    classes: shape({
        root: string,
        content: string,
        errorCode: string,
        header: string,
        message: string,
        actionsContainer: string
    })
};

export default ErrorView;
