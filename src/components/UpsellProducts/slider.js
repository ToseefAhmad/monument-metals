import { arrayOf, shape, string, number, bool } from 'prop-types';
import React, { useRef, useEffect } from 'react';
import SlickSlider from 'react-slick';

import Item from './item';
import classes from './slider.module.css';

const Slider = ({ products, storeConfigData, isPrevSlide, isNextSlide }) => {
    const ref = useRef(null);

    const settings = {
        arrows: false,
        infinite: false,
        draggable: false,
        speed: 300
    };

    useEffect(() => {
        ref.current.slickPrev();
    }, [isPrevSlide]);

    useEffect(() => {
        ref.current.slickNext();
    }, [isNextSlide]);

    return (
        <div className={classes.root}>
            <SlickSlider ref={ref} {...settings}>
                {products.map(product => (
                    <Item key={product.uid} product={product} storeConfigData={storeConfigData} />
                ))}
            </SlickSlider>
        </div>
    );
};

Slider.propTypes = {
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
    }),
    isPrevSlide: bool,
    isNextSlide: bool
};

export default Slider;
