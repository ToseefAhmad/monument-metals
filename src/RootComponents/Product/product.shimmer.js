import React from 'react';

import { BreadcrumbShimmer } from '@app/components/overrides/Breadcrumbs';
import classes from '@app/components/overrides/ProductFullDetail/productFullDetail.module.css';
import TrustpilotShimmer from '@app/components/overrides/ProductFullDetail/trustpilot.shimmer';
import CarouselShimmer from '@app/components/overrides/ProductImageCarousel/carousel.shimmer';
import SliderShimmer from '@app/pageBuilder/ContentTypes/Products/products.shimmer';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const ProductShimmer = () => {
    return (
        <>
            <BreadcrumbShimmer />
            <div className={classes.root}>
                <div className={classes.topContainer}>
                    <div className={classes.carouselWrapper}>
                        <section className={classes.imageCarousel}>
                            <CarouselShimmer />
                        </section>
                    </div>
                    <div className={classes.detailsWrapper}>
                        <section className={classes.title}>
                            <Shimmer width="100%" height={2} key="product-name" />
                            <div className={classes.productPrice}>
                                <Shimmer width={3} height={2} key="product-price" />
                            </div>
                        </section>
                        <section className={classes.productTile}>
                            <Shimmer width="100%" height="100%" key="product-tile" />
                        </section>

                        <section className={classes.actionButtons}>
                            <Shimmer width="100%" height={6} />
                        </section>
                    </div>
                </div>
            </div>
            <div className={classes.productDetails}>
                <Shimmer width="100%" height={2} />
                <section className={classes.description}>
                    <Shimmer width="100%" height={3} />
                    <Shimmer width="100%" height={2} />
                    <Shimmer width="100%" height={8} />
                </section>
            </div>
            <SliderShimmer />
            <TrustpilotShimmer />
        </>
    );
};

export default ProductShimmer;
