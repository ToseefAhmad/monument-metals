import { Form } from 'informed';
import { string, number, shape } from 'prop-types';
import React from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Popup from 'reactjs-popup';

import { isPrice } from '../priceValidation';
import { METAL_ALERTS, MetalSelect, InitMetal, PriceSelect } from '../shared';
import { usePrice } from '../usePrice';

import { CustomInfo } from '@app/components/MonumentIcons';
import SignIn from '@app/components/overrides/SignIn';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { POPUP_CONFIG_DEFAULT_SIZES } from '@app/util/popup';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Select from '@magento/venia-ui/lib/components/Select';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './metalPriceButton.module.css';

const MetalPriceButton = ({ sku, classes: propClasses, metalType }) => {
    const initMetalType = metalType ? metalType.toString() : InitMetal;
    const type = METAL_ALERTS;
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

    const classes = useStyle(defaultClasses, propClasses);

    const { formatMessage } = useIntl();

    const { isMobileScreen } = useScreenSize();

    const button = (
        <Button onClick={handleOpen} priority="normal" size="small">
            <Icon src={CustomInfo} />
            <FormattedMessage id={'productFullDetail.marketAlert'} defaultMessage={'Add market alert'} />
        </Button>
    );

    const formContent = isLoading ? (
        <LoadingIndicator />
    ) : (
        <div className={classes.content}>
            <p className={classes.description}>
                <FormattedMessage
                    id="productAlerts.metalDescription"
                    defaultMessage="Fill out the form below, and we’ll send you an alert when the selected metal price reaches your desired threshold!"
                />
            </p>
            <Form getApi={setFormApi} onSubmit={handleSubmit}>
                <Field
                    id="metal_type"
                    label={formatMessage({
                        id: 'global.alertType',
                        defaultMessage: 'Metal'
                    })}
                    classes={{ root: classes.field }}
                >
                    <Select
                        field="metal_type"
                        id="metal_type"
                        items={MetalSelect}
                        initialValue={initMetalType}
                        validate={isRequired}
                    />
                </Field>
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
                    <TextInput field="price" id="price" validate={isPrice} />
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
                        <FormattedMessage id="productAlerts.addPriceAlert" defaultMessage={'Add Market Alert'} />
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
        <div className={classes.root}>
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

MetalPriceButton.propTypes = {
    classes: shape({
        content: string,
        root: string
    }),
    sku: string,
    metalType: number
};

export default MetalPriceButton;
