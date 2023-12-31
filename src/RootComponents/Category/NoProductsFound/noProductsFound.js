import { number, string, shape } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useNoProductsFound } from '@magento/peregrine/lib/talons/RootComponents/Category';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from './noProductsFound.module.css';
import noProductsFound from './noProductsFound.png';

const NoProductsFound = props => {
    const { categoryId } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const talonProps = useNoProductsFound({
        categoryId
    });

    const { recommendedCategories } = talonProps;

    const categoryItems = useMemo(() => {
        return recommendedCategories.map(category => {
            const uri = resourceUrl(`/${category.url_path}${category.url_suffix}`);

            return (
                <li key={category.id} className={classes.listItem}>
                    <Link to={uri}>{category.name}</Link>
                </li>
            );
        });
    }, [classes, recommendedCategories]);

    const headerText = formatMessage({
        id: 'noProductsFound.noProductsFound',
        defaultMessage: "Sorry! We couldn't find any products."
    });

    return (
        <div className={classes.root}>
            <Image
                alt={headerText}
                classes={{ image: classes.image, root: classes.imageContainer }}
                src={noProductsFound}
            />
            <h2 className={classes.title}>{headerText}</h2>
            <div className={classes.categories}>
                <p>
                    <FormattedMessage
                        id={'noProductsFound.tryOneOfTheseCategories'}
                        defaultMessage={'Try one of these categories'}
                    />
                </p>
                <ul className={classes.list}>{categoryItems}</ul>
            </div>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string,
        list: string,
        categories: string,
        listItem: string,
        image: string,
        imageContainer: string
    })
};
