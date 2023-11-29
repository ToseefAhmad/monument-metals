import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './noProductBlock.module.css';
import noProductsFound from './NoSearchResultFound.png';

const NoProductsBlock = ({ productName }) => {
    const { formatMessage } = useIntl();
    const headerTextFirst = formatMessage({
        id: 'noProductsFound.noProductsFoundFirst',
        defaultMessage: 'Sorry!'
    });
    const headerTextSecond = formatMessage({
        id: 'noProductsFound.noProductsFoundSecond',
        defaultMessage: "We couldn't find any products."
    });

    return (
        <div className={classes.root}>
            <div className={classes.bannerBlock}>
                <div className={classes.imgBlock}>
                    <Image alt={headerTextSecond} src={noProductsFound} width={358} height={305} />
                </div>
                <div className={classes.textBlock}>
                    <h2 className={classes.title}>
                        {headerTextFirst}
                        <br className="lg_hidden" />
                        &nbsp;
                        {headerTextSecond}
                    </h2>
                    <div className={classes.categories}>
                        <p>
                            <FormattedMessage
                                id={'noProductsFound.tryOneOfTheseCategoriesFirst'}
                                defaultMessage={"We're sorry - we couldn’t find product"}
                            />
                            <span className="font-semibold text-blue">{productName}.</span>
                            <FormattedMessage
                                id={'noProductsFound.tryOneOfTheseCategoriesSecond'}
                                defaultMessage={'Try our one of our suggested categories.'}
                            />
                        </p>
                    </div>
                    <div className={classes.actions}>
                        <Link className={classes.toHomeButton} to={resourceUrl('/')}>
                            <FormattedMessage id="noProductsFound.continueShopping" defaultMessage="Go to homepage" />
                        </Link>
                    </div>
                </div>
            </div>
            <CmsBlock
                identifiers={'recommended_products_slider'}
                classes={{ root: classes.recommendedProductsSlider }}
            />
        </div>
    );
};

export default NoProductsBlock;

NoProductsBlock.propTypes = {
    productName: string
};

NoProductsBlock.defaultProps = {
    productName: ''
};
