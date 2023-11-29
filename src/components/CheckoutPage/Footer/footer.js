import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    VisaLight,
    PaypalLight,
    MastercardLight,
    DiscoverLight,
    AmericanExpressLight,
    WireTransferLight,
    EcheckLight
} from '@app/components/MonumentIcons';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Logo from '@magento/venia-ui/lib/components/Logo';

import classes from './footer.module.css';

const ICONS_LIST = [
    VisaLight,
    PaypalLight,
    MastercardLight,
    DiscoverLight,
    AmericanExpressLight,
    WireTransferLight,
    EcheckLight
];

const Footer = () => {
    return (
        <footer className={classes.root}>
            <div className={classes.container}>
                <div className={classes.content}>
                    <div className={classes.logoContainer}>
                        <Logo variant="light" />
                    </div>
                    <div className={classes.paymentContainer}>
                        <span className={classes.paymentText}>
                            <FormattedMessage
                                id="checkoutPageFooter.secureShoppingExperience"
                                defaultMessage="100% Secure shopping experience"
                            />
                        </span>
                        <ul className={classes.paymentList}>
                            {ICONS_LIST.map((icon, index) => (
                                <li className={classes.paymentItem} key={index}>
                                    <Icon src={icon} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
