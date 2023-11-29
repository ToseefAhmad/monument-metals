import { arrayOf, string, shape } from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight as ArrowRightIcon } from '@app/components/MonumentIcons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from './categoryTile.module.css';
import { useCategoryTile } from './useCategoryTile';

const IMAGE_WIDTH = 165;
const IMAGE_RATIO = 1;

const CategoryTile = props => {
    const talonProps = useCategoryTile({
        item: props.item,
        storeConfig: props.storeConfig
    });

    const { image, item } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const imagePreview = useMemo(() => {
        return image.url ? (
            <Image
                alt={item.name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                resource={image.url}
                type={image.type}
                width={IMAGE_WIDTH}
                ratio={IMAGE_RATIO}
            />
        ) : (
            <span className={classes.image_empty} />
        );
    }, [classes.image, classes.image_empty, classes.imageContainer, image.type, image.url, item.name]);

    const categoryUrl = window.location.pathname.split('.html')[0]; // I don't think its optimal solution

    return (
        <Link className={classes.root} to={categoryUrl + item.url}>
            {imagePreview}
            <div className={classes.content}>
                <span className={classes.name}>{item.name}</span>
                <div className={classes.shopNow}>
                    <span className={classes.shopButton}>Shop now</span>
                    <Icon src={ArrowRightIcon} classes={{ root: classes.arrowIcon }} />
                </div>
            </div>
        </Link>
    );
};

CategoryTile.propTypes = {
    item: shape({
        image: string,
        name: string.isRequired,
        productImagePreview: shape({
            items: arrayOf(
                shape({
                    small_image: string
                })
            )
        }),
        url_key: string.isRequired
    }).isRequired,
    classes: shape({
        item: string,
        image: string,
        imageContainer: string,
        name: string
    }),
    storeConfig: shape({
        category_url_suffix: string.isRequired
    }).isRequired
};
export default CategoryTile;
