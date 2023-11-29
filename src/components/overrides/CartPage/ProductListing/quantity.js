import { Form } from 'informed';
import { func, number, string, bool, object } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Minus as MinusIcon, Plus as PlusIcon } from '@app/components/MonumentIcons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './quantity.module.css';
import { useQuantity } from './useQuantity';

export const QuantityFields = ({ initialValue, itemId, min, onChange, message, disabled, classes: propClasses }) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const iconClasses = { root: classes.icon };

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleChange,
        handleDecrement,
        handleIncrement,
        maskInput
    } = useQuantity({
        initialValue,
        min,
        onChange
    });

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <>
            <div className={classes.root}>
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    classes={{ input: classes.input }}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    onBlur={handleChange}
                    pattern="[0-9]*"
                    disabled={disabled}
                />
                <div className={classes.buttonsWrapper}>
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonIncrement',
                            defaultMessage: 'Increase Quantity'
                        })}
                        className={classes.button_increment}
                        disabled={isIncrementDisabled || disabled}
                        onClick={handleIncrement}
                        type="button"
                    >
                        <Icon classes={iconClasses} src={PlusIcon} />
                    </button>
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonDecrement',
                            defaultMessage: 'Decrease Quantity'
                        })}
                        className={classes.button_decrement}
                        disabled={isDecrementDisabled || disabled}
                        onClick={handleDecrement}
                        type="button"
                    >
                        <Icon classes={iconClasses} src={MinusIcon} />
                    </button>
                </div>
            </div>
            {errorMessage}
        </>
    );
};

const Quantity = props => {
    return (
        <Form
            id={props.formId}
            initialValues={{
                quantity: props.initialValue
            }}
            onSubmit={props.handleAddToCart}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    handleAddToCart: func,
    formId: string
};

Quantity.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {},
    handleAddToCart: () => {},
    formId: ''
};

QuantityFields.propTypes = {
    classes: object,
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    message: string,
    disabled: bool
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    disabled: false,
    onChange: () => {}
};

export default Quantity;
