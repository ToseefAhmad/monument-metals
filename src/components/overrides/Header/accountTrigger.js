import { shape, string } from 'prop-types';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import AccountChip from '@app/components/overrides/AccountChip';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountTrigger.module.css';
import { useAccountTrigger } from './useAccountTrigger';

const AccountMenu = React.lazy(() =>
    import(/* webpackChunkName: "accountMenu" */ '@app/components/overrides/AccountMenu')
);

/**
 * The AccountTrigger component is the call to action in the site header
 * that toggles the AccountMenu dropdown.
 *
 * @param {Object} props
 * @param {Object} props.classes - CSS classes to override element styles.
 */
const AccountTrigger = props => {
    const talonProps = useAccountTrigger();
    const { accountMenuRef, accountMenuTriggerRef, handleTriggerClick } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    return (
        <>
            <div className={classes.root} ref={accountMenuTriggerRef}>
                <button
                    aria-label={formatMessage({
                        id: 'accountTrigger.ariaLabel',
                        defaultMessage: 'Toggle My Account Menu'
                    })}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                >
                    <AccountChip
                        fallbackText={formatMessage({
                            id: 'accountTrigger.buttonFallback',
                            defaultMessage: 'Sign Up'
                        })}
                        shouldIndicateLoading={true}
                    />
                </button>
            </div>
            <Suspense fallback={null}>
                <AccountMenu ref={accountMenuRef} />
            </Suspense>
        </>
    );
};

export default AccountTrigger;

AccountTrigger.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        trigger: string
    })
};
