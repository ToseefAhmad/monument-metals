import { useFieldApi } from 'informed';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState, useEffect } from 'react';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

/**
 * This talon contains logic for a product quantity UI component.
 * It performs effects and returns prop data for rendering a component that lets you
 * modify the quantity of a cart item.
 *
 * This talon performs the following effects:
 *
 * - Updates the state of the quantity field when the initial value changes
 *
 * @function
 *
 * @param {Object} props
 * @param {number} props.initialValue the initial quantity value
 * @param {number} props.min the minimum allowed quantity value
 * @param {function} props.onChange change handler to invoke when quantity value changes
 *
 * @returns {QuantityTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';
 */
export const MAX_QUANTITY = 10000;
export const useQuantity = props => {
    const { initialValue, min, onChange } = props;

    const [prevQuantity, setPrevQuantity] = useState(initialValue);

    const quantityFieldApi = useFieldApi('quantity');
    const { value: quantity } = useFieldState('quantity');

    const isIncrementDisabled = useMemo(() => !quantity, [quantity]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // Actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 1, [quantity]);

    const handleOnChangeDebounced = useMemo(
        () =>
            debounce(value => {
                onChange(value);
            }, 350),
        [onChange]
    );

    const handleDecrement = useCallback(() => {
        const newQuantity = quantity - 1;
        const parsedQuantity = Math.max(min, Math.min(MAX_QUANTITY, Number(newQuantity)));
        quantityFieldApi.setValue(parsedQuantity);
        setPrevQuantity(parsedQuantity);
        handleOnChangeDebounced(parsedQuantity);
    }, [handleOnChangeDebounced, min, quantity, quantityFieldApi]);

    const handleIncrement = useCallback(() => {
        const newQuantity = quantity + 1;
        const parsedQuantity = Math.max(min, Math.min(MAX_QUANTITY, Number(newQuantity)));
        quantityFieldApi.setValue(parsedQuantity);
        setPrevQuantity(parsedQuantity);
        handleOnChangeDebounced(parsedQuantity);
    }, [handleOnChangeDebounced, min, quantity, quantityFieldApi]);

    const handleChange = useCallback(
        event => {
            // If user left input empty on blur set old qty value.
            // In cart if user left empty input then 'newQuantity' should be 0 and item should be removed from cart.
            const newQuantity =
                event.target.value || (min === 0 && !event.target.value)
                    ? Math.max(min, Math.min(MAX_QUANTITY, Number(event.target.value)))
                    : prevQuantity;
            quantityFieldApi.setValue(newQuantity);
            // Only submit the value change if it has changed.
            if (newQuantity != prevQuantity) {
                setPrevQuantity(newQuantity);
                handleOnChangeDebounced(newQuantity);
            }
        },
        [handleOnChangeDebounced, min, prevQuantity, quantityFieldApi]
    );

    const maskInput = useCallback(
        value => {
            try {
                // For some storefronts decimal values are allowed.
                const nextVal = parseFloat(value);
                if (value && isNaN(nextVal)) throw new Error(`${value} is not a number.`);
                if (nextVal < min) return min;
                else return nextVal;
            } catch (err) {
                console.error(err);
                return prevQuantity;
            }
        },
        [min, prevQuantity]
    );

    /**
     * Everytime initialValue changes, update the quantity field state.
     */
    useEffect(() => {
        quantityFieldApi.setValue(initialValue);
    }, [initialValue, quantityFieldApi]);

    return {
        isDecrementDisabled,
        isIncrementDisabled,
        handleChange,
        handleDecrement,
        handleIncrement,
        maskInput
    };
};

/** JSDoc type definitions */

/**
 * Object type returned by the {@link useQuantity} talon.
 * It provides props data for a quantity UI component.
 *
 * @typedef {Object} QuantityTalonProps
 *
 * @property {boolean} isDecrementDisabled True if decrementing should be disabled
 * @property {boolean} isIncrementDisabled True if incrementing should be disabled
 * @property {function} handleChange Callback function for handling a change event on a component
 * @property {function} handleDecrement Callback function for handling a quantity decrement event
 * @property {function} handleIncrement Callback function for handling an increment event
 * @property {function} maskInput Function for masking a value when decimal values are allowed
 */
