import { Form } from 'informed';
import { string } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Popup from 'reactjs-popup';

import { POPUP_CONFIG_DEFAULT_SIZES } from '@app/util/popup';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './notifyStockButton.module.css';
import { useNotify } from './useNotify';

const NotifyStockButton = ({ sku }) => {
    const {
        handleSubmit,
        isLoading,
        isLoadingGuest,
        isSignedIn,
        userEmail,
        setFormApi,
        formApiRef,
        popupRef,
        handleClose,
        isSuccess,
        handleOpen,
        isOpen
    } = useNotify({
        sku
    });
    const { formatMessage } = useIntl();

    const button = (
        <Button onClick={handleOpen} priority="normal" className={classes.notifyTriggerButton}>
            <FormattedMessage id="productAlerts.notifyStockBtn" defaultMessage="Notify Me" />
        </Button>
    );
    const formattedUserEmail = <b>{userEmail}</b>;

    const informationSubtext =
        isSignedIn && !isSuccess ? (
            <p className={classes.headerSubText}>
                <FormattedMessage
                    id="productAlerts.notifyStockSubText"
                    values={{
                        userEmail: formattedUserEmail
                    }}
                    defaultMessage="To receive an e-mail sent to {userEmail} once the product comes back in stock, click on the button below"
                />
            </p>
        ) : (
            ''
        );

    const emailField = !isSignedIn ? (
        <div className={classes.field}>
            <Field
                id="notify-stock-email"
                label={formatMessage({
                    id: 'global.email',
                    defaultMessage: 'Email'
                })}
            >
                <TextInput
                    id="notify-stock-email"
                    field="email"
                    placeholder={formatMessage({ id: 'global.emailPlaceholder', defaultMessage: 'Enter the e-mail' })}
                    validate={isRequired}
                />
            </Field>
        </div>
    ) : null;

    const qtyField = (
        <div className={classes.field}>
            <Field
                id="notify-stock-qty"
                label={formatMessage({
                    id: 'global.qty',
                    defaultMessage: 'Quantity'
                })}
            >
                <TextInput
                    field="qty"
                    id="notify-stock-qty"
                    type="number"
                    placeholder={formatMessage({ id: 'global.qtyPlaceholder', defaultMessage: 'Enter the quantity' })}
                    initialValue={1}
                    validate={isRequired}
                />
            </Field>
        </div>
    );

    const content =
        isLoading || isLoadingGuest ? (
            <LoadingIndicator />
        ) : (
            <div className={classes.content}>
                <Form getApi={setFormApi} onSubmit={handleSubmit}>
                    {emailField}
                    {qtyField}
                </Form>
                <div className={classes.actions}>
                    <Button
                        priority="normal"
                        className={classes.notifyButton}
                        onClick={() => {
                            formApiRef.current.submitForm();
                        }}
                    >
                        <FormattedMessage id="productAlerts.notifyStockBtn" defaultMessage="Notify Me" />
                    </Button>
                </div>
            </div>
        );

    const header = isSuccess ? (
        <FormattedMessage id="productAlerts.successTitle" defaultMessage={'We got you!'} />
    ) : (
        <FormattedMessage id="productAlerts.notifyStockHead" defaultMessage="Notify me when this item is in stock" />
    );

    const successBlock = (
        <div className={classes.content}>
            <p className={classes.description}>
                <FormattedMessage
                    id="productAlerts.stockSuccessMessage"
                    defaultMessage="You will receive an e-mail once the product is back in stock"
                />
            </p>
            <div className={classes.actions}>
                <Button
                    priority="normal"
                    className={classes.notifyButton}
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <FormattedMessage id="productAlerts.continueShopping" defaultMessage="Continue Shopping" />
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {button}
            <Popup open={isOpen} ref={popupRef} {...POPUP_CONFIG_DEFAULT_SIZES} nested>
                <div className={classes.modal}>
                    <div className={classes.closeIcon}>
                        <button onClick={handleClose}>
                            <Icon src={CloseIcon} size={32} />
                        </button>
                    </div>
                    <div className={classes.header}>
                        <h4>{header}</h4>
                        {informationSubtext}
                    </div>
                    {isSuccess ? successBlock : content}
                </div>
            </Popup>
        </div>
    );
};

NotifyStockButton.propTypes = {
    sku: string
};

export default NotifyStockButton;
