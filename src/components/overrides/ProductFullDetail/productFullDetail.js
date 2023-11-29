import classnames from 'classnames';
import { Form } from 'informed';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import React, { Suspense } from 'react';
import { Info } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { CheckMark, Remove, Shipping } from '@app/components/MonumentIcons';
import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import { NotifyStockButton } from '@app/components/ProductAlerts';
import MetalPriceButton from '@app/components/ProductAlerts/MetalPrice/metalPriceButton';
import ProductPriceButton from '@app/components/ProductAlerts/ProductPrice/productPriceButton';
import { AmProductLabelProvider } from '@app/components/ProductLabels';
import { ProductPrice } from '@app/components/TierPrice';
import UpsellProducts from '@app/components/UpsellProducts';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useToasts } from '@app/hooks/useToasts';
import Products from '@app/pageBuilder/ContentTypes/Products/products';
import Button from '@magento/venia-ui/lib/components/Button';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import 'react-tabs/style/react-tabs.css';
import classes from './productFullDetail.module.css';
import { useProductFullDetail } from './useProductFullDetail';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

// Correlate a GQL error message to a field. GQL could return a longer error
// String but it may contain contextual info such as product id. We can use
// Parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = ({ product, storeConfigData }) => {
    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        isOutOfStock,
        isPreorder,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        setSubmitFormApi,
        handleSubmitReview,
        isSubmitting,
        reviews,
        loadingReviews,
        handleLoadReviews,
        allReviewsVisible,
        additionalInformation,
        productsFromVariants,
        productTileRef,
        isProductTileLarge,
        recentlyViewedProducts,
        isCopyrightVisible,
        wishlistButtonProps
    } = useProductFullDetail({ product });
    const [toastState] = useToasts();
    const isAnyToast = toastState?.toasts?.size;

    const { formatMessage } = useIntl();
    const { isMobileScreen, isDesktopScreen } = useScreenSize();

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs categoryId={breadcrumbCategoryId} currentProduct={productDetails.name} />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // This would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (errorMessage.includes('Variable "$cartId" got invalid value null')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage: 'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const cartCallToActionText = isPreorder ? (
        <FormattedMessage id="productFullDetail.preorderItemToCart" defaultMessage="Preorder" />
    ) : !isOutOfStock ? (
        <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
    ) : (
        <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
    );

    const productStatus = isPreorder ? (
        <span className={classes.preorder}>
            <FormattedMessage id="productFullDetail.preorderStatus" defaultMessage="Preorder" />
        </span>
    ) : !isOutOfStock ? (
        <span className={classes.inStock}>
            <FormattedMessage id="productFullDetail.inStockStatus" defaultMessage="In stock" />
        </span>
    ) : (
        <span className={classes.outOfStock}>
            <FormattedMessage id="productFullDetail.outOfStockStatus" defaultMessage="Out-of-Stock" />
        </span>
    );

    const noteBlock = isPreorder ? (
        <div className={classes.preorderNote}>
            <Icon src={Shipping} />
            <span className={classes.preorderMessage}>
                <strong>{productDetails.preorderNote}</strong>
            </span>
        </div>
    ) : (
        <CmsBlock
            identifiers={'header-store-information'}
            classes={{
                root: classes.shippingRoot,
                content: classes.shippingContet,
                block: classes.shippingBlock
            }}
        />
    );

    const productStatusIcon = isOutOfStock ? (
        <Icon classes={{ root: classes.iconOutOfStock }} src={Remove} />
    ) : (
        <Icon classes={{ root: isPreorder ? classes.iconPreorder : classes.iconInStock }} src={CheckMark} />
    );

    // "Add to cart" button sticky
    const { isVisible, elementRef: actionRef } = useElementVisibility();

    const actionContainerClass = isVisible
        ? classes.actionContainerStatic
        : isCopyrightVisible
        ? classes.actionContainerStatic
        : isAnyToast
        ? classes.actionContainerFixedSpacer
        : classes.actionContainerFixed;

    const cartActionContent = isSupportedProductType ? (
        <Button disabled={isAddToCartDisabled} priority="normal" type="submit">
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={'This product is currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    const cartAction =
        !isPreorder && isOutOfStock ? (
            <NotifyStockButton sku={productDetails.sku} isVisible={isVisible} />
        ) : (
            cartActionContent
        );

    const alertButtonsContent = (
        <div className={classes.alertButtonsContainer}>
            <MetalPriceButton sku={productDetails.sku} metalType={productDetails.metalType} />
            <ProductPriceButton sku={productDetails.sku} price={productDetails.mainPrice} />
        </div>
    );

    // Reviews tab
    const nameLabel = <FormattedMessage id={'productFullDetail.reviewsNameLabel'} defaultMessage={'Name'} />;

    const summaryLabel = (
        <FormattedMessage id={'productFullDetail.reviewsSummaryLabel'} defaultMessage={'Summary of your review'} />
    );

    const reviewLabel = <FormattedMessage id={'productFullDetail.reviewsTextLabel'} defaultMessage={'Review'} />;

    const loadedReviews = reviews
        ? reviews.map(review => {
              const reviewText = allReviewsVisible ? review.text : review.text.substring(0, 250);
              return (
                  <div key={review.summary} className={classes.review}>
                      <h5>{review.summary}</h5>

                      <p>{reviewText}</p>
                      <div>{review.nickname}</div>
                  </div>
              );
          })
        : null;

    const loadMoreContainer = allReviewsVisible ? classes.hidden : classes.buttonContainer;

    // Additional inforomation
    const customAttributes = additionalInformation
        ? additionalInformation.productAttributes.map(attribute => {
              // Check for empty select values
              const attributeValue = attribute.attribute_value === 'false' ? null : attribute.attribute_value;

              return (
                  <li key={attribute.attribute_name}>
                      {attribute.attribute_name}:<span className={classes.attributeValue}>{attributeValue}</span>
                  </li>
              );
          })
        : null;

    // Product tile sizing
    const largeTileClass = isProductTileLarge ? classes.productTileLarge : null;
    // Previously searched products
    const recentLyViewedCarousel = recentlyViewedProducts ? (
        <Products
            appearance="carousel"
            pathNames={recentlyViewedProducts}
            arrows={true}
            carouselMode="default"
            centerPadding="90px"
            contentType="products"
        />
    ) : null;

    const headerContent = (
        <>
            <section className={classes.title}>
                <h1 className={classes.productName}>{productDetails.name}</h1>
            </section>
            <section className={classnames([classes.productTile, largeTileClass])} ref={productTileRef}>
                <div className={classes.productTileSKU}>
                    <FormattedMessage id={'productFullDetail.productCode'} defaultMessage={'Product code:'} />
                    <strong className={classes.skuText}>{productDetails.sku}</strong>
                </div>
                <span className={classes.seperator} />
                <div className={classes.productTileAvailability}>
                    {productStatusIcon}
                    <span className={classes.availabilityText}>
                        <FormattedMessage
                            id={'productFullDetail.productAvailability'}
                            defaultMessage={'Product availability: '}
                        />
                    </span>
                    {productStatus}
                </div>
                {noteBlock}
            </section>
        </>
    );

    const productPrice = !isOutOfStock ? (
        <section className={classes.priceBlock}>
            <ProductPrice
                mainPrice={productDetails.mainPrice}
                tierPrices={productDetails.tierPrices}
                shortDescription={productDetails.shortDescription}
            />
        </section>
    ) : null;

    return (
        <AmProductLabelProvider products={product} mode={'PRODUCT'} productsFromVariants={productsFromVariants}>
            {breadcrumbs}
            <div className={classes.root}>
                <div className={classes.topContainer}>
                    {isMobileScreen && headerContent}
                    <div className={classes.carouselWrapper}>
                        <section className={classes.imageCarousel}>
                            <Carousel images={mediaGalleryEntries} />
                        </section>
                    </div>
                    <div className={classes.detailsWrapper}>
                        {isDesktopScreen && headerContent}
                        {productPrice}
                        <section className={classes.actionButtons} ref={actionRef}>
                            <Form onSubmit={handleAddToCart}>
                                <div className={actionContainerClass}>
                                    <QuantityFields
                                        classes={{
                                            root: classes.quantityRoot,
                                            input: classes.quantityInput,
                                            button_decrement: classes.quantityButtonDecrement,
                                            button_increment: classes.quantityButtonIncrement
                                        }}
                                        min={1}
                                        message={errors.get('quantity')}
                                    />
                                    <div className={classes.cartActionWrapper}>{cartAction}</div>
                                </div>
                            </Form>
                        </section>
                        <div className={classes.detailsBottomWrapper}>
                            <section className={classes.upsellSection}>
                                <UpsellProducts products={product.upsell_products} storeConfigData={storeConfigData} />
                            </section>
                            <section className={classes.aleartsSection}>{alertButtonsContent}</section>
                            <section className={classes.wishlistButtonWrapper}>
                                <Suspense fallback={null}>
                                    <WishlistButton
                                        classes={{
                                            root: classes.addToListButton,
                                            root_selected: classes.addToListButton_selected
                                        }}
                                        {...wishlistButtonProps}
                                    />
                                </Suspense>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.productDetails}>
                <h2 className={classes.productDetailsHeading}>
                    <FormattedMessage
                        id={'productFullDetail.productDetailsHeading'}
                        defaultMessage={'Product details'}
                    />
                </h2>
                <section className={classes.description}>
                    <Tabs className={classes.tabsContainer} selectedTabPanelClassName={classes.tabPanel}>
                        <div className={classes.tabsHeaderContainer}>
                            <TabList className={classes.tabList}>
                                <Tab className={classes.tab} selectedClassName={classes.selectedTab}>
                                    <FormattedMessage
                                        id={'productFullDetail.productDescription'}
                                        defaultMessage={'Product description'}
                                    />
                                </Tab>
                                <Tab className={classes.tab} selectedClassName={classes.selectedTab}>
                                    <FormattedMessage
                                        id={'productFullDetail.additionalInfo'}
                                        defaultMessage={'Additional information'}
                                    />
                                </Tab>
                                <Tab className={classes.tab} selectedClassName={classes.selectedTab}>
                                    <FormattedMessage id={'productFullDetail.reviews'} defaultMessage={'Reviews'} />
                                </Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <span className={classes.descriptionTitle} />
                            <RichContent classes={{ root: classes.tabContent }} html={productDetails.description} />
                        </TabPanel>
                        <TabPanel className={classes.additionalInfoTab}>
                            <ul className={classes.additionalInfoList}>{customAttributes}</ul>
                        </TabPanel>
                        <TabPanel className={classes.reviewsTab}>
                            <Form
                                onSubmit={handleSubmitReview}
                                getApi={setSubmitFormApi}
                                className={classes.reviewsForm}
                            >
                                <Field id="name" label={nameLabel}>
                                    <TextInput
                                        field="name"
                                        placeholder={formatMessage({
                                            id: 'productFullDetail.reviewsNamePlaceholder',
                                            defaultMessage: 'Enter the name'
                                        })}
                                        maxLength="30"
                                        classes={{ input: classes.reviewInput }}
                                    />
                                </Field>
                                <Field id="summary" label={summaryLabel}>
                                    <TextInput
                                        field="summary"
                                        placeholder={formatMessage({
                                            id: 'productFullDetail.reviewsSummaryPlaceholder',
                                            defaultMessage: 'Enter the summary of your review"'
                                        })}
                                        maxLength="30"
                                        classes={{ input: classes.reviewInput }}
                                    />
                                </Field>
                                <Field id="review" label={reviewLabel}>
                                    <TextArea
                                        field="review"
                                        id="review"
                                        placeholder={formatMessage({
                                            id: 'productFullDetail.reviewsTextPlaceholder',
                                            defaultMessage: 'Enter the review'
                                        })}
                                        maxLength="2000"
                                    />
                                </Field>
                                <Button priority="normal" type="submit" disabled={isSubmitting}>
                                    <FormattedMessage
                                        id={'productFullDetail.reviewsSubmit'}
                                        defaultMessage={'Submit review'}
                                    />
                                </Button>
                            </Form>
                            <div className={classes.reviewsContainer}>
                                {loadedReviews}
                                {reviews && !allReviewsVisible && (
                                    <div className={loadMoreContainer}>
                                        <Button priority="low" onClick={handleLoadReviews} disabled={loadingReviews}>
                                            <FormattedMessage
                                                id={'productFullDetail.reviewsLoad'}
                                                defaultMessage={'Load more'}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    </Tabs>
                </section>
            </div>
            <div>
                <div className={classes.previouslySearched}>
                    <h2 className={classes.previouslySearchedTitle}>
                        <FormattedMessage
                            id={'productFullDetail.suggestedProducts'}
                            defaultMessage={'Suggested Products'}
                        />
                    </h2>
                    {recentLyViewedCarousel}
                </div>
            </div>
            <CmsBlock
                classes={{ block: classes.shopperApprovedBlock, root: classes.shopperApproved }}
                identifiers="shopperApproved-block"
            />
        </AmProductLabelProvider>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        price_tiers: arrayOf(
            shape({
                final_price: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                }),
                fee_price: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                }),
                quantity: number.isRequired
            })
        ),
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired,
    storeConfigData: shape({
        storeConfig: shape({
            __typename: string,
            id: number,
            product_url_suffix: string
        })
    })
};

export default ProductFullDetail;
