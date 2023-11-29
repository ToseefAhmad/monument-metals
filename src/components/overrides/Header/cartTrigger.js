import { shape, string } from 'prop-types';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import { Cart as CartIcon, Dropdown as DropdownIcon } from '@app/components/MonumentIcons';
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './cartTrigger.module.css';

const MiniCart = React.lazy(() =>
    import(/* webpackChunkName: "miniCart" */ '@magento/venia-ui/lib/components/MiniCart')
);

const CartTrigger = props => {
    const {
        handleTriggerClick,
        itemCount,
        miniCartRef,
        miniCartIsOpen,
        hideCartTrigger,
        setMiniCartIsOpen,
        miniCartTriggerRef
    } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage(
        {
            id: 'cartTrigger.ariaLabel',
            defaultMessage: 'Toggle mini cart. You have {count} items in your cart.'
        },
        { count: itemCount }
    );
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;

    const mobileCounter = itemCount ? <span className={classes.mobileCounter}>{itemCountDisplay}</span> : null;

    const itemTextDisplay =
        itemCount === 1
            ? formatMessage({
                  id: 'cartTrigger.itemProduct',
                  defaultMessage: 'product'
              })
            : formatMessage({
                  id: 'cartTrigger.itemProducts',
                  defaultMessage: 'products'
              });

    const cartTrigger = hideCartTrigger ? null : (
        // Because this button behaves differently on desktop and mobile
        // We render two buttons that differ only in their click handler
        // And control which one displays via CSS.
        <>
            <div className={classes.triggerContainer} ref={miniCartTriggerRef}>
                <button aria-label={buttonAriaLabel} className={classes.trigger} onClick={handleTriggerClick}>
                    <span className={classes.cart}>
                        <Icon src={CartIcon} />
                        <div className={classes.wrapper}>
                            <span className={classes.textSmall}>My Cart</span>
                            <div className={classes.textWrapper}>
                                <span className={classes.text}>
                                    {itemCountDisplay} {itemTextDisplay}
                                </span>
                                <Icon src={DropdownIcon} />
                            </div>
                        </div>
                    </span>
                </button>
            </div>
            <button aria-label={buttonAriaLabel} className={classes.link} onClick={handleTriggerClick}>
                <Icon src={CartIcon} />
                {mobileCounter}
            </button>
            <Suspense fallback={null}>
                <MiniCart isOpen={miniCartIsOpen} setIsOpen={setMiniCartIsOpen} ref={miniCartRef} />
            </Suspense>
        </>
    );

    return cartTrigger;
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        counter: string,
        link: string,
        openIndicator: string,
        root: string,
        trigger: string,
        triggerContainer: string
    })
};
