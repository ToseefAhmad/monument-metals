import { arrayOf, shape, string, number } from 'prop-types';
import React, { useState } from 'react';

import { ArrowLargeLeft, ArrowLargeRight } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';

import Item from './item';
import Slider from './slider';
import classes from './upsellProducts.module.css';

const UpsellProducts = ({ products, storeConfigData }) => {
    const [isNextSlide, setNextSlide] = useState(false);
    const [isPrevSlide, setPrevSlide] = useState(false);

    if (!products.length) {
        return null;
    }

    const isShowSlider = products.length > 1;

    const handlePrevSlide = () => {
        setPrevSlide(!isPrevSlide);
    };

    const handleNextSlide = () => {
        setNextSlide(!isNextSlide);
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <h5 className={classes.heading}>Recommended Supplies</h5>
                <div className={classes.actions}>
                    {isShowSlider && (
                        <>
                            <div className={classes.button}>
                                <Button priority="low" onPress={handlePrevSlide}>
                                    <Icon src={ArrowLargeLeft} />
                                </Button>
                            </div>
                            <div className={classes.button}>
                                <Button priority="low" onPress={handleNextSlide}>
                                    <Icon src={ArrowLargeRight} />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className={classes.content}>
                {!isShowSlider && <Item product={products[0]} storeConfigData={storeConfigData} />}
                {isShowSlider && (
                    <Slider
                        products={products}
                        storeConfigData={storeConfigData}
                        isNextSlide={isNextSlide}
                        isPrevSlide={isPrevSlide}
                    />
                )}
            </div>
        </div>
    );
};

UpsellProducts.propTypes = {
    products: arrayOf(
        shape({
            __typename: string,
            id: number,
            uid: string,
            sku: string,
            name: string,
            url_key: string,
            small_image: shape({
                label: string,
                url: string
            }),
            price_range: shape({
                __typename: string,
                maximum_price: shape({
                    __typename: string,
                    final_price: shape({
                        __typename: string,
                        currency: string,
                        value: number
                    })
                })
            }),
            price_tiers: arrayOf(
                shape({
                    __typename: string,
                    quantity: number,
                    final_price: shape({
                        __typename: string,
                        currency: string,
                        value: number
                    })
                })
            )
        })
    ),
    storeConfigData: shape({
        storeConfig: shape({
            __typename: string,
            id: number,
            product_url_suffix: string
        })
    })
};

export default UpsellProducts;
