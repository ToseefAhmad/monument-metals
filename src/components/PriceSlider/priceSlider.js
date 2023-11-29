import { Form } from 'informed';
import debounce from 'lodash.debounce';
import { array, func, shape } from 'prop-types';
import Slider from 'rc-slider';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { usePriceSlider } from '@app/components/PriceSlider/usePriceSlider';
import 'rc-slider/assets/index.css';
import setValidator from '@magento/peregrine/lib/validators/set';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import classes from './priceSlider.module.css';

const PriceSlider = props => {
    const { items, onApply, filterApi, filterState } = props;
    const { setGroupItem } = filterApi;

    const { minPrice, maxPrice, defaultRange, setFormApi, formApiRef } = usePriceSlider({ items, filterState });

    const [priceRange, setPriceRange] = useState(defaultRange);

    const handleApply = useCallback(
        value => {
            setGroupItem({
                group: 'price',
                item: { title: `${value[0]}-${value[1]}`, value: `${value[0]}_${value[1]}` }
            });
            if (typeof onApply === 'function') {
                onApply('price', { title: `${value[0]}-${value[1]}`, value: `${value[0]}_${value[1]}` });
            }
        },
        [onApply, setGroupItem]
    );

    const handleSlide = useCallback(
        value => {
            setPriceRange(value);
            formApiRef.current.setValue('priceRange[0]', value[0]);
            formApiRef.current.setValue('priceRange[1]', value[1]);
        },
        [formApiRef]
    );

    const debounceOnChange = useMemo(
        () =>
            debounce(value => {
                handleApply(value);
                setPriceRange(value);
            }, 1000),
        [handleApply]
    );

    useEffect(() => {
        if (!filterState || (filterState && [...filterState].length < 1)) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [filterState, maxPrice, minPrice]);

    return (
        <div className={classes.root}>
            {/* both rules disabled, because this just prevents bubbling */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div className={classes.sliderWrapper} onClick={() => {}}>
                <Slider
                    className={classes.slider}
                    range
                    min={minPrice}
                    max={maxPrice}
                    defaultValue={defaultRange}
                    allowCross={false}
                    value={priceRange}
                    onChange={handleSlide}
                />
            </div>
            <Form
                className={classes.priceSectionWrapper}
                getApi={setFormApi}
                onValueChange={e => debounceOnChange(e.priceRange)}
            >
                <Field classes={{ root: classes.priceField }} id="priceRange[0]">
                    <TextInput
                        classes={{ input: classes.priceInput }}
                        field="priceRange[0]"
                        type="number"
                        initialValue={priceRange[0]}
                        onClick={e => e.target.select()}
                    />
                </Field>
                <Field classes={{ root: classes.priceField }} id="priceRange[1]">
                    <TextInput
                        classes={{ input: classes.priceInput }}
                        field="priceRange[1]"
                        type="number"
                        initialValue={priceRange[1]}
                        onClick={e => e.target.select()}
                    />
                </Field>
            </Form>
        </div>
    );
};

PriceSlider.propTypes = {
    items: array,
    onApply: func,
    filterApi: shape({}),
    filterState: setValidator
};

export default PriceSlider;
