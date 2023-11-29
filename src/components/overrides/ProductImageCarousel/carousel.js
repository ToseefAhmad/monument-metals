import { arrayOf, bool, number, shape, string, object } from 'prop-types';
import React, { useMemo, useState } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import AmProductLabels from '@app/components/ProductLabels';
import { useProductImageCarousel } from '@magento/peregrine/lib/talons/ProductImageCarousel/useProductImageCarousel';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AriaButton from '@magento/venia-ui/lib/components/AriaButton';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.module.css';
import Thumbnail from '@magento/venia-ui/lib/components/ProductImageCarousel/thumbnail';

const IMAGE_WIDTH = 550;
const IMAGE_HEIGHT = 550;
const IMAGE_RATIO = 1;

/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a product image
 */
const ProductImageCarousel = props => {
    const VISIBLE_IMAGES = 6;
    const { images } = props;
    const { formatMessage } = useIntl();
    const talonProps = useProductImageCarousel({
        images,
        imageWidth: IMAGE_WIDTH,
        visibleImages: VISIBLE_IMAGES
    });

    const {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages,
        firstVisibleIndex
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    // Create thumbnail image component for every images in sorted order
    const thumbnails = useMemo(
        () =>
            sortedImages.map((item, index) => {
                let thumbnailWrapperClass = classes.visible;
                if (index > firstVisibleIndex + VISIBLE_IMAGES - 1) {
                    // Hide images on right side
                    thumbnailWrapperClass = classes.hidden;
                } else if (index < firstVisibleIndex) {
                    // Hide images on the left side
                    thumbnailWrapperClass = classes.hidden;
                }

                return (
                    <Thumbnail
                        key={item.uid}
                        classes={{ root: thumbnailWrapperClass }}
                        item={item}
                        itemIndex={index}
                        isActive={activeItemIndex === index}
                        onClickHandler={handleThumbnailClick}
                    />
                );
            }),
        [activeItemIndex, handleThumbnailClick, sortedImages, classes.visible, classes.hidden, firstVisibleIndex]
    );

    // Set direction from which image appears
    const [direction, setDirection] = useState('left');

    const showPrevImage = () => {
        setDirection('left');
        handlePrevious();
    };

    const showNextImage = () => {
        setDirection('right');
        handleNext();
    };

    let transitionClasses;
    if (direction == 'left') {
        transitionClasses = {
            enter: classes.fromLeftEnter,
            enterActive: classes.fromLeftEnterActive,
            exitActive: classes.fromLeftExitActive
        };
    } else {
        transitionClasses = {
            enter: classes.fromRightEnter,
            enterActive: classes.fromRightEnterActive,
            exitActive: classes.fromRightExitActive
        };
    }

    let image;
    if (currentImage.file) {
        image = (
            <CSSTransition
                key={currentImage.file}
                in={true}
                classNames={transitionClasses}
                timeout={{ enter: 300, exit: 300 }}
            >
                <Image
                    alt={altText}
                    classes={{
                        image: classes.currentImage,
                        root: classes.imageContainer
                    }}
                    resource={currentImage.file}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    ratio={IMAGE_RATIO}
                    displayPlaceholder={false}
                />
            </CSSTransition>
        );
    } else {
        image = (
            <Image
                alt={''}
                classes={{
                    image: classes.currentImagePlaceholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    }

    const previousButton = formatMessage({
        id: 'productImageCarousel.previousButtonAriaLabel',
        defaultMessage: 'Previous Image'
    });

    const nextButton = formatMessage({
        id: 'productImageCarousel.nextButtonAriaLabel',
        defaultMessage: 'Next Image'
    });

    const chevronClasses = { root: classes.imageChevron };
    const thumbnailChevronClasses = { root: classes.thumbnailChevron };

    /* Thumbnail carousle */
    const thumbnailsRight =
        sortedImages.length > VISIBLE_IMAGES ? (
            <AriaButton
                className={classes.thumbnailsRight}
                onPress={showNextImage}
                aria-label={previousButton}
                type="button"
            >
                <Icon classes={thumbnailChevronClasses} src={ChevronRightIcon} size={17} attrs={{ stroke: 'white' }} />
            </AriaButton>
        ) : null;

    const thumbnailCarousel = (
        <>
            {thumbnails}
            {thumbnailsRight}
        </>
    );

    /* Swipe motion */
    let touchXStart = 0;

    const handleTouchStart = e => {
        touchXStart = e.touches && e.touches[0] && e.touches[0].screenX ? e.touches[0].screenX : null;
    };

    const [exitWillBrake, setExitWillBreak] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    const handleTouchEnd = e => {
        const touchXEnd =
            e.changedTouches && e.changedTouches[0] && e.changedTouches[0].screenX ? e.changedTouches[0].screenX : null;
        if (touchXStart && touchXEnd && touchXStart > touchXEnd) {
            setSwipeDirection('left');
            setExitWillBreak(false);

            if (direction == 'left') {
                setExitWillBreak(true);
            }
            showNextImage();
        } else if (touchXStart && touchXEnd && touchXStart < touchXEnd) {
            setSwipeDirection('right');
            setExitWillBreak(false);

            if (direction == 'right') {
                setExitWillBreak(true);
            }
            showPrevImage();
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.carouselContainer} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <AmProductLabels mode={'PRODUCT'} productWidth={IMAGE_WIDTH} />
                <ProductImageCounter currentImage={activeItemIndex + 1} totalImages={sortedImages.length} />
                <AriaButton
                    className={classes.previousButton}
                    onPress={showPrevImage}
                    aria-label={previousButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronLeftIcon} size={17} attrs={{ stroke: 'white' }} />
                </AriaButton>
                <TransitionGroup
                    component={null}
                    childFactory={child => {
                        if (exitWillBrake && swipeDirection == 'right') {
                            transitionClasses = {
                                enter: classes.fromLeftEnter,
                                enterActive: classes.fromLeftEnterActive,
                                exitActive: classes.fromLeftExitActive
                            };
                        } else if (exitWillBrake && swipeDirection == 'left') {
                            transitionClasses = {
                                enter: classes.fromRightEnter,
                                enterActive: classes.fromRightEnterActive,
                                exitActive: classes.fromRightExitActive
                            };
                        }
                        return React.cloneElement(child, { classNames: transitionClasses });
                    }}
                >
                    {image}
                </TransitionGroup>
                <AriaButton
                    className={classes.nextButton}
                    onPress={showNextImage}
                    aria-label={nextButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronRightIcon} size={17} />
                </AriaButton>
            </div>
            <div className={classes.thumbnailList}>{thumbnailCarousel}</div>
        </div>
    );
};

/**
 * Props for {@link ProductImageCarousel}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * ProductImageCarousel component
 * @property {string} classes.currentImage classes for visible image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 * @property {Object[]} images Product images input for Carousel
 * @property {bool} images[].disabled Is image disabled
 * @property {string} images[].file filePath of image
 * @property {string} images[].uid the id of the image
 * @property {string} images[].label label for image
 * @property {string} images[].position Position of image in Carousel
 */
ProductImageCarousel.propTypes = {
    classes: shape({
        carouselContainer: string,
        currentImage: string,
        currentImage_placeholder: string,
        imageContainer: string,
        nextButton: string,
        previousButton: string,
        root: string
    }),
    images: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired,
            uid: string.isRequired
        })
    ).isRequired
};

const ProductImageCounter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { currentImage, totalImages } = props;

    return (
        <span className={classes.imageCounter}>
            {currentImage}/{totalImages}
        </span>
    );
};

ProductImageCounter.propTypes = {
    classes: object,
    currentImage: number,
    totalImages: number
};

export default ProductImageCarousel;
