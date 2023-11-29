import { Form } from 'informed';
import { shape, string, number } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Popup from 'reactjs-popup';

import { isPrice } from '../priceValidation';
import { PRICE_ALERTS, PriceSelect } from '../shared';
import { usePrice } from '../usePrice';

import { Dollar } from '@app/components/MonumentIcons';
import SignIn from '@app/components/overrides/SignIn';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { POPUP_CONFIG_DEFAULT_SIZES } from '@app/util/popup';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './productPriceButton.module.css';

const ProductPriceButton = ({ sku, price }) => {
    const type = PRICE_ALERTS;
    const {
        handleSubmit,
        isLoading,
        isSignedIn,
        setFormApi,
        formApiRef,
        popupRef,
        handleClose,
        isSuccess,
        handleOpen,
        isOpen
    } = usePrice({
        sku,
        type
    });

    const { isMobileScreen } = useScreenSize();

    const { formatMessage } = useIntl();

    const button = (
        <Button onClick={handleOpen} priority="alert" size="small">
            <Icon src={Dollar} />
            <FormattedMessage id={'productAlerts.addPriceAlert'} defaultMessage={'Add Price Alert'} />
        </Button>
    );

    const formContent = isLoading ? (
        <LoadingIndicator />
    ) : (
        <div className={classes.content}>
            <p className={classes.description}>
                <FormattedMessage
                    id="productAlerts.metalDescription"
                    defaultMessage="Fill out the form below, and we’ll send you an alert when the selected product price reaches your desired threshold!"
                />
            </p>
            <Form getApi={setFormApi} onSubmit={handleSubmit}>
                <Field
                    id="type"
                    label={formatMessage({
                        id: 'global.alertType',
                        defaultMessage: 'Type'
                    })}
                    classes={{ root: classes.field }}
                >
                    <Select field="type" id="type" items={PriceSelect} initialValue="1" validate={isRequired} />
                </Field>
                <Field
                    id="price"
                    label={formatMessage({
                        id: 'global.price',
                        defaultMessage: 'Price'
                    })}
                    classes={{ root: classes.field }}
                >
                    <TextInput
                        field="price"
                        id="price"
                        initialValue={price.final_price.value.toString()}
                        validate={isPrice}
                    />
                </Field>
            </Form>
            <div className={classes.actions}>
                <Button
                    priority="normal"
                    className={classes.notifyButton}
                    onClick={() => {
                        formApiRef.current.submitForm();
                    }}
                >
                    <FormattedMessage id="productAlerts.addAlert" defaultMessage="Add Alert" />
                </Button>
            </div>
        </div>
    );

    const successBlock = (
        <div className={classes.content}>
            <p className={classes.description}>
                <FormattedMessage
                    id="productAlerts.successMessage"
                    defaultMessage="You will receive an e-mail once configured price is reached"
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

    const content = isSignedIn ? formContent : <SignIn />;

    const heading =
        isSignedIn || isMobileScreen ? (
            <div className={classes.header}>
                <h4>
                    {!isSignedIn && isMobileScreen ? (
                        <FormattedMessage id="productAlerts.addPriceAlert" defaultMessage={'Login'} />
                    ) : (
                        <FormattedMessage id="productAlerts.addPriceAlert" defaultMessage={'Add Price Alert'} />
                    )}
                </h4>
            </div>
        ) : null;

    const successHeading = (
        <div className={classes.header}>
            <h4>
                <FormattedMessage id="productAlerts.successTitle" defaultMessage={'We got you!'} />
            </h4>
        </div>
    );

    return (
        <div>
            {button}
            <Popup open={isOpen} ref={popupRef} {...POPUP_CONFIG_DEFAULT_SIZES} onClose={handleClose} nested>
                <div className={classes.modal}>
                    <button className={classes.closeIcon} onClick={handleClose}>
                        <Icon size={32} src={CloseIcon} />
                    </button>
                    {isSuccess ? successHeading : heading}
                    {isSuccess ? successBlock : content}
                </div>
            </Popup>
        </div>
    );
};

ProductPriceButton.propTypes = {
    sku: string,
    price: shape({
        final_price: shape({
            value: number
        })
    })
};

export default ProductPriceButton;
