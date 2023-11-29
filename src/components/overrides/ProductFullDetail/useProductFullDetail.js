import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { useProductAddedModalContext } from '@app/components/ProductAddedModal/useProductAddedModalContext';
import { useCaptcha } from '@app/hooks/useCaptcha';
import { useOnScroll } from '@app/hooks/useOnScroll';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { GET_ADDITIONAL_PRODCT_DETAILS as getAdditionalProductDetails } from './additionalDetails.gql';
import { GET_ALL_CATEGORIES as getAllCategories } from './allCategories.gql';
import defaultOperations from './productFullDetail.gql';
import { SUBMIT_REVIEW, GET_REVIEWS } from './productReviews.gql';
import { GET_SAME_CATEGORY_PRODUCTS as getSameCatergoryProducts } from './sameCategoryProducts.gql';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
const PREORDER_CODE = 'PREORDER';
const LARGE_TILE_WIDTH = 500;

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const { attribute_id, attribute_code } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const isProductSelected = (item, selectedProduct) => {
    return item.attributes.every(element => {
        if (typeof selectedProduct.get(element.code) === 'undefined') {
            return true;
        }

        return element['value_index'] === selectedProduct.get(element.code);
    });
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // Option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(value => !!value).length;

    return numProductSelections < numProductOptions;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item.product.stock_status === OUT_OF_STOCK_CODE;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};

const getIsPreorder = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item.product.stock_status === PREORDER_CODE;
    }

    return stock_status === PREORDER_CODE;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // Variant's image to the media gallery. NOTE: This _can_, and does,
        // Include variants such as size. If Magento is configured to display
        // An image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? [...item.product.media_gallery_entries, ...media_gallery_entries] : media_gallery_entries;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// Product has multiple related categories. This function filters and selects
// One category id for that purpose.
export const getBreadcrumbCategoryId = (categories, prevPath) => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }

    // Get only active categories, filter by not equal to false to make sure the field exists to not break anything else
    const activeCategories = categories.filter(category => category.is_active !== false);

    let matchedPrevCategoryId = null;
    if (prevPath) {
        const matchPathLastPartRegex = new RegExp('[^/]+.(?=.html)');
        const matchedPrevPath = prevPath.match(matchPathLastPartRegex);
        const prevCategoryPath = matchedPrevPath && matchedPrevPath[0];
        const matchedPrevCategory = activeCategories.find(category => category.url_key === prevCategoryPath);
        matchedPrevCategoryId = matchedPrevCategory && matchedPrevCategory.id;
    }

    const breadcrumbSet = new Set();
    activeCategories.forEach(({ breadcrumbs }) => {
        // Breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // Will just return the first category id of the potential leaf categories.
    const leafCategory = activeCategories.find(category => !breadcrumbSet.has(category.id));

    if (matchedPrevCategoryId) {
        return matchedPrevCategoryId;
    }

    if (leafCategory && leafCategory.id) {
        return leafCategory.id;
    }

    if (activeCategories && activeCategories[0] && activeCategories[0].id) {
        return activeCategories[0].id;
    }
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price_range.maximum_price.final_price.value;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? item.price_range.maximum_price.final_price.value
            : product.price_range.maximum_price.final_price.value;
    }

    return value;
};

/**
 * Search for products parent categories.
 *
 * @param {Array} productCategories - all categories of current product
 * @param {Array} allCategories - haystack (data.categoryList attribute of query result)
 * @returns {Array} String array of parent category id's
 */
const getParentCategories = (productCategories, allCategories) => {
    const parentCategories = [];
    for (let i = 0; i < productCategories.length; i++) {
        const parentCategoryFound = getParentCategory(productCategories[i], allCategories);
        if (parentCategoryFound) {
            while (parentCategoryFound.length) parentCategories.push(parentCategoryFound.shift());
        }
    }
    return parentCategories;
};

/**
 * Search for parent categories of specific category.
 *
 * @param {Array} productCategory - needle, category of the current product
 * @param {Array} allCategories - haystack (data.categoryList attribute of query result)

 * @returns {Array}  String array of parent category id's
 */
const getParentCategory = (productCategory, allCategories) => {
    const queue = [];
    let current = { categories: allCategories, parent: [] };

    queue.push(current);
    while (queue.length) {
        current = queue.shift();
        const elementIndex = current.categories.findIndex(element => {
            return element.id == productCategory;
        });

        if (elementIndex >= 0) {
            return current.parent;
        } else {
            // Not found, push all not visited children to queue
            for (let i = 0; i < current.categories.length; i++) {
                if (current.categories[i].children) {
                    const combinedParents = current.parent.concat(current.categories[i].id.toString());
                    queue.push({
                        categories: current.categories[i].children,
                        parent: combinedParents
                    });
                }
            }
        }
    }
    return null;
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 *  wishlistButtonProps,
 *  wishlistItemOptions,
 *  setSubmitFormApi: func,
 *  handleSubmitReview: func,
 *  isSubmitting: boolean,
 *  reviews: array,
 *  handleLoadReviews: func,
 *  allReviewsVisible: boolean,
 * isCopyrightVisible: boolean
 * }}
 */
export const useProductFullDetail = props => {
    // If there is less than this number of products in category, parent category products will be used
    const MIN_PRODUCTS_IN_CATEGORY = 20;

    const { addConfigurableProductToCartMutation, addSimpleProductToCartMutation, product } = props;

    const [, { addToast }] = useToasts();
    const { trackAddToCart, getProductCategories } = useTracking();
    const location = useLocation();

    const hasDeprecatedOperationProp = !!(addConfigurableProductToCartMutation || addSimpleProductToCartMutation);

    const operations = mergeOperations(defaultOperations, props.operations);

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const { setShowModal, setModalData } = useProductAddedModalContext();

    // eslint-disable-next-line no-warning-comments
    // TODO: Fix for search
    const firstProductImage = useMemo(() => {
        const mediaGallery = product?.media_gallery_entries || [];

        if (mediaGallery.length > 0) {
            return [...mediaGallery].sort((a, b) => a.position - b.position)[0].file;
        }

        return '';
    }, [product]);

    const { data: storeConfigData } = useQuery(operations.getWishlistConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [addToCartQty, setAddToCartQty] = useState(1);

    const handleAddToCardResponse = data => {
        const response = data && data.addProductsToCart;
        const hasErrors = response.user_errors && response.user_errors.length > 0;

        if (hasErrors) {
            response.user_errors.map(error => {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            });
        } else {
            if (addToCartQty > 1) {
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage(
                        {
                            id: 'addToCart.successMsgQty',
                            defaultMessage: `You added {quantity} items of {name} to your shopping cart.`
                        },
                        {
                            name: product.name,
                            quantity: addToCartQty
                        }
                    )
                });
            } else {
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage(
                        {
                            id: 'addToCart.successMsg',
                            defaultMessage: `You added {name} to your shopping cart.`
                        },
                        {
                            name: product.name
                        }
                    )
                });
            }

            setModalData({
                name: product.name,
                image: firstProductImage,
                qty: addToCartQty,
                stock_status: product.stock_status,
                preorder_note: product.preorder_note
            });
            setShowModal(true);
        }
    };

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct, loading: isAddConfigurableLoading }
    ] = useMutation(addConfigurableProductToCartMutation || operations.addConfigurableProductToCartMutation, {
        onCompleted: handleAddToCardResponse
    });

    const [addSimpleProductToCart, { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }] = useMutation(
        addSimpleProductToCartMutation || operations.addSimpleProductToCartMutation,
        {
            onCompleted: handleAddToCardResponse
        }
    );

    const [addProductToCart, { error: errorAddingProductToCart, loading: isAddProductLoading }] = useMutation(
        operations.addProductToCartMutation,
        {
            onCompleted: handleAddToCardResponse
        }
    );

    const breadcrumbCategoryId = useMemo(() => getBreadcrumbCategoryId(product.categories, location.state?.prevPath), [
        location.state?.prevPath,
        product.categories
    ]);

    const derivedOptionSelections = useMemo(() => deriveOptionSelectionsFromProduct(product), [product]);

    const [optionSelections, setOptionSelections] = useState(derivedOptionSelections);

    const derivedOptionCodes = useMemo(() => deriveOptionCodesFromProduct(product), [product]);
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(() => getIsMissingOptions(product, optionSelections), [product, optionSelections]);

    const isOutOfStock = useMemo(() => getIsOutOfStock(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const isPreorder = useMemo(() => getIsPreorder(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const mediaGalleryEntries = useMemo(() => getMediaGalleryEntries(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values.find(item => item.value_index === value);

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            setAddToCartQty(quantity);

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(payload, optionSelections, optionCodes);
                }

                if (isSupportedProductType) {
                    const variables = {
                        cartId,
                        parentSku: payload.parentSku,
                        product: payload.item,
                        quantity: payload.quantity,
                        sku: payload.item.sku
                    };
                    // Use the proper mutation for the type.
                    if (productType === 'SimpleProduct') {
                        try {
                            await addSimpleProductToCart({
                                variables
                            });
                        } catch (error) {
                            addToast({
                                type: ToastType.ERROR,
                                message: error.message,
                                timeout: false
                            });
                            return;
                        }
                    } else if (productType === 'ConfigurableProduct') {
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                        } catch (error) {
                            addToast({
                                type: ToastType.ERROR,
                                message: error.message,
                                timeout: false
                            });
                            return;
                        }
                    }
                } else {
                    console.error('Unsupported product type. Cannot add to cart.');
                }
            } else {
                const variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }

                try {
                    await addProductToCart({ variables });
                    trackAddToCart({
                        currencyCode: product.price_range.maximum_price.final_price.currency,
                        price: product.price_range.maximum_price.final_price.value,
                        products: [
                            {
                                ...product,
                                quantity,
                                price: product.price_range.maximum_price.final_price.value,
                                currency: product.price_range.maximum_price.final_price.currency,
                                category: getProductCategories(product.categories)
                            }
                        ]
                    });
                } catch (error) {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                    return;
                }
            }
        },
        [
            addConfigurableProductToCart,
            addProductToCart,
            addSimpleProductToCart,
            addToast,
            cartId,
            getProductCategories,
            hasDeprecatedOperationProp,
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productType,
            selectedOptionsArray,
            trackAddToCart
        ]
    );

    const selectedProduct = useMemo(() => {
        const result = new Map();

        if (optionSelections) {
            optionSelections.forEach((value, key) => {
                result.set(optionCodes.get(key), value);
            });
        }

        return result;
    }, [optionCodes, optionSelections]);

    const productsFromVariants = useMemo(() => {
        if (!product.variants) {
            return null;
        }

        const result = [];

        product.variants.forEach(item => {
            if (isProductSelected(item, selectedProduct)) {
                result.push(item.product.id);
            }
        });

        return product.variants.length === result.length ? [] : result;
    }, [product, selectedProduct]);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // Of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const productPrice = useMemo(() => getConfigPrice(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        shortDescription: product.short_description,
        name: product.name,
        price: productPrice,
        sku: product.sku,
        preorderNote: product.preorder_note,
        metalType: product.metal_type,
        tierPrices: product.price_tiers,
        mainPrice: product.price_range.maximum_price
    };

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([errorAddingSimpleProduct, errorAddingConfigurableProduct, errorAddingProductToCart]),
        [errorAddingConfigurableProduct, errorAddingProductToCart, errorAddingSimpleProduct]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'addWishlistButton.addedText',
                      defaultMessage: 'Added to Wishlist'
                  })
                : formatMessage({
                      id: 'addWishlistButton.addText',
                      defaultMessage: 'Add to Wishlist'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    // Handle review submission

    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

    const [submitReviewMutation] = useMutation(SUBMIT_REVIEW, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const formApiRef = useRef(null);
    const setSubmitFormApi = useCallback(api => (formApiRef.current = api), []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = useCallback(
        async ({ name, summary, review }) => {
            setIsSubmitting(true);
            try {
                await executeCaptchaValidation();
                await submitReviewMutation({
                    variables: { sku: product.sku, nickname: name, summary: summary, text: review }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'productFullDetail.reviewsSubmitSuccess',
                        defaultMessage: 'Thank you for submitting review.'
                    })
                });
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: formatMessage({
                        id: 'productFullDetail.reviewsSubmitError',
                        defaultMessage: 'Please, fill out all the input fields to successfully submit a review'
                    }),
                    timeout: false
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        [addToast, submitReviewMutation, formatMessage, product, executeCaptchaValidation]
    );

    // Get existing reviews
    const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
    const [allReviewsVisible, setAllReviewsVisible] = useState(false);
    const [reviews, setReviews] = useState([]);

    const { data: products, loading: loadingReviews } = useQuery(GET_REVIEWS, {
        variables: { urlKey: product.url_key, pageSize: 3, currentPage: reviewsCurrentPage },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (reviews && products && products.products.items[0].reviews.items) {
            const reviewCount = products.products.items[0].review_count;

            if (reviewCount <= 3) {
                setAllReviewsVisible(true);
                return;
            }

            if (reviews.length == reviewCount) {
                setAllReviewsVisible(true);
                return;
            }
        }
    }, [reviews, products]);

    const addToReviewArray = useCallback(
        newReviews => {
            setReviews(reviews.concat(newReviews));
        },
        [reviews]
    );

    useEffect(() => {
        if (products && products.products.items[0]) {
            addToReviewArray(products.products.items[0].reviews.items);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const handleLoadReviews = () => {
        setReviewsCurrentPage(reviewsCurrentPage + 1);
    };

    // Get additional data tab
    const { data: additionalInformation } = useQuery(getAdditionalProductDetails, {
        variables: { id: product.id },
        fetchPolicy: 'cache-and-network'
    });

    /* Product tile sizing */
    const [isProductTileLarge, setIsProductTileLarge] = useState(false);

    const productTileRef = useCallback(node => {
        if (node) {
            const div1Width = node.children[0].offsetWidth;
            const div2Width = node.children[2].offsetWidth;

            if (div1Width + div2Width > LARGE_TILE_WIDTH) {
                setIsProductTileLarge(true);
            } else {
                setIsProductTileLarge(false);
            }
        }
    }, []);
    // Recently viewed products
    const productCategories = useMemo(() => product.categories.map(category => category.id.toString()), [product]);

    const { data: sameCategoryResult, loading: sameCategoryProductsLoading } = useQuery(getSameCatergoryProducts, {
        variables: { categories: productCategories },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-only'
    });

    const filterByStockStatus = products => {
        return products && products.products.items.filter(product => product.stock_status !== 'OUT_OF_STOCK');
    };

    const sameCategoryProducts = useMemo(() => {
        if (!sameCategoryProductsLoading) {
            const filteredProducts = filterByStockStatus(sameCategoryResult);
            return sameCategoryResult && sameCategoryResult.products && sameCategoryResult.products.items
                ? filteredProducts
                : null;
        }
        return null;
    }, [sameCategoryResult, sameCategoryProductsLoading]);

    // If there is not enough products in this category, get all categories
    const { data: allCategoriesQuery, loading: allCategoriesLoading } = useQuery(getAllCategories, {
        variables: { categories: productCategories },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-only',
        skip:
            !sameCategoryResult ||
            !sameCategoryResult.products ||
            sameCategoryResult.products.items.length >= MIN_PRODUCTS_IN_CATEGORY
    });

    // Traverse allCategories , find categories that are in the product, get their parent categories
    const parentCategories = useMemo(() => {
        return allCategoriesQuery ? getParentCategories(productCategories, allCategoriesQuery.categoryList) : null;
    }, [productCategories, allCategoriesQuery]);

    const { data: parentCategoryProducts, loading: parentCategoryProductsLoading } = useQuery(
        getSameCatergoryProducts,
        {
            variables: { categories: parentCategories },
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-only',
            skip: !parentCategories
        }
    );

    const shuffleProducts = productsArray => {
        if (!productsArray) {
            return null;
        }
        return productsArray.map(item => item.url_key).slice(0, 20);
    };

    const recentlyViewedProducts = useMemo(() => {
        const filteredParentCategoryProducts = filterByStockStatus(parentCategoryProducts);
        const combinedProducts =
            sameCategoryProducts && filteredParentCategoryProducts && parentCategoryProducts
                ? sameCategoryProducts.concat(filteredParentCategoryProducts)
                : sameCategoryProducts;

        if (!sameCategoryProductsLoading && !allCategoriesLoading && !parentCategoryProductsLoading) {
            const uniqueCombinedProducts = [...new Set(combinedProducts.map(item => item))];
            return shuffleProducts(uniqueCombinedProducts);
        }
        return null;
    }, [
        sameCategoryProductsLoading,
        allCategoriesLoading,
        parentCategoryProductsLoading,
        parentCategoryProducts,
        sameCategoryProducts
    ]);
    /* Add to cart sticky button */
    const { innerHeight } = useWindowSize();

    const [isCopyrightVisible, setCopyrightVisible] = useState(false);

    const watchScroll = () => {
        const mainRef = document.querySelector('.copyrightText');

        const domRect = mainRef.getBoundingClientRect();
        const TOP_OFFSET = 100;

        if (domRect.bottom - TOP_OFFSET > 0) {
            if (domRect.bottom > innerHeight) {
                setCopyrightVisible(false);
            } else if (domRect.bottom < innerHeight) {
                setCopyrightVisible(true);
            }
        } else if (domRect.bottom - TOP_OFFSET < 0) {
            setCopyrightVisible(false);
        }
    };

    useOnScroll(globalThis.document, watchScroll);

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isPreorder,
        isAddToCartDisabled:
            isOutOfStock || isMissingOptions || isAddConfigurableLoading || isAddSimpleLoading || isAddProductLoading,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn && storeConfigData && !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        wishlistButtonProps,
        wishlistItemOptions,
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
        isCopyrightVisible
    };
};
