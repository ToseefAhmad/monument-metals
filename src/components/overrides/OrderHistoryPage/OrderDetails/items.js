import { shape, arrayOf, string, number, array } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Item from './item';
import defaultClasses from './items.module.css';

const Items = props => {
    const { items, imagesData } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const itemsComponent = items.map(item => <Item key={item.id} {...item} {...imagesData[item.product_sku]} />);

    return <div className={classes.root}>{itemsComponent}</div>;
};

export default Items;

Items.propTypes = {
    classes: shape({
        root: string
    }),
    items: array,
    data: shape({
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                product_url_key: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        )
    }),
    imagesData: arrayOf(
        shape({
            id: number,
            sku: string,
            thumbnail: shape({
                url: string
            }),
            url_key: string,
            url_suffix: string
        })
    )
};
