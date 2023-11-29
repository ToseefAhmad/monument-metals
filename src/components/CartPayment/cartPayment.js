import classnames from 'classnames';
import { Form, RadioGroup, Radio } from 'informed';
import { func, bool } from 'prop-types';
import React, { useMemo } from 'react';
import { Circle, Check, ChevronsDown } from 'react-feather';

import { useScreenSize } from '@app/hooks/useScreenSize';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './cartPayment.module.css';
import CartPaymentShimmer from './cartPayment.shimmer';
import { useCartPayment } from './useCartPayment';

const CartPayment = ({ fetchCartDetails, setPaymentSelected, refreshPayment, setRefreshPayment }) => {
    const {
        defaultPaymentDescription,
        activePaymentOption,
        descriptionTitle,
        activeDescription,
        defaultPaymentTitle,
        paymentMethodData,
        descriptionList,
        dispatchTitle,
        descriptionSize,
        defaultPaymentSize,
        descriptionFee,
        handleOptionChange,
        initialValues,
        isLoading,
        onMouseOverHandler,
        onFocus,
        onMouseLeaveHandler
    } = useCartPayment({
        fetchCartDetails,
        setPaymentSelected,
        refreshPayment,
        setRefreshPayment
    });
    const { isMobileScreen } = useScreenSize();

    const mobileTitleClass = useMemo(() => {
        if (descriptionSize === 'medium') return classes.labelMobile;
        if (descriptionSize === 'small') return classes.labelMobileSmall;
        if (descriptionSize === 'large') return classes.labelMobileLarge;
    }, [descriptionSize]);

    const lowestPriceLabel = useMemo(
        () =>
            descriptionFee === 0 &&
            !isMobileScreen && (
                <div className={classes.lowestPrice}>
                    <Icon
                        classes={{
                            root: classes.iconRootCheck
                        }}
                        src={Check}
                        size={14}
                    />
                    <span className={classes.discount}>{`Lowest Price`}</span>
                </div>
            ),
        [descriptionFee, isMobileScreen]
    );

    const desktopPaymentHeaderTab = useMemo(
        () =>
            !isMobileScreen && (
                <div className={classes.paymentHeaderTab}>
                    <Icon classes={{ root: classes.iconRootChevrons }} src={ChevronsDown} size={18} />
                    <p className={classes.paymentHeader}> Select Payment Method</p>
                    <Icon classes={{ root: classes.iconRootChevrons }} src={ChevronsDown} size={18} />
                </div>
            ),
        [isMobileScreen]
    );

    const descriptionListItems = useMemo(
        () =>
            descriptionList &&
            descriptionList.length > 0 &&
            descriptionList.map(item => (
                <div key={item} className={classes.listItemWrapper}>
                    <p className={classes.listItem}>{item}</p>
                </div>
            )),
        [descriptionList]
    );

    const paymentOptions = useMemo(
        () =>
            paymentMethodData.map(
                ({
                    code,
                    fee,
                    content,
                    label,
                    descriptionTitle,
                    active,
                    dispatchTitle,
                    descriptionList,
                    descriptionSize
                }) => {
                    const disabledMethod = !active;

                    const iconPath = `/static-assets/icons/cart/${code}.png`;
                    const icon = iconPath && <img alt={`${label} icon`} src={iconPath} />;

                    const mobileDescriptionListItems =
                        descriptionList &&
                        descriptionList.map(item => (
                            <div key={item} className={classes.listItemWrapper}>
                                <p className={classes.listItem}>{item}</p>
                            </div>
                        ));

                    const option = (
                        <div className={classes.option}>
                            <div className={classes.inputLabel}>
                                <Radio
                                    className={classes.input}
                                    type="radio"
                                    name="payment"
                                    value={code}
                                    disabled={disabledMethod}
                                    field={code}
                                />
                                <span className={classes.icon}>
                                    <Icon
                                        src={Circle}
                                        size={16}
                                        classes={{ root: classes.iconRoot, icon: classes.iconSvg }}
                                    />
                                </span>
                                <span className={disabledMethod ? classes.titleDisabled : classes.title}>{label}</span>
                            </div>
                        </div>
                    );

                    const showDescription = descriptionList || content;
                    const mobileContent = showDescription && isMobileScreen && activePaymentOption === code && (
                        <div className={classes.content}>
                            <span className={mobileTitleClass}>{`${descriptionTitle} ${dispatchTitle}`}</span>

                            <div className={classes.mobileContent}>{content}</div>
                            {mobileDescriptionListItems}
                        </div>
                    );

                    return (
                        <div key={code}>
                            <label
                                className={classnames({
                                    [classes.optionParentDisabled]: disabledMethod,
                                    [classes.optionParent]: !disabledMethod && activePaymentOption !== code,
                                    [classes.optionParent_active]: !disabledMethod && activePaymentOption === code
                                })}
                                onMouseOver={() =>
                                    onMouseOverHandler({
                                        disabledMethod,
                                        isMobileScreen,
                                        content,
                                        fee,
                                        dispatchTitle,
                                        descriptionTitle,
                                        descriptionList,
                                        descriptionSize
                                    })
                                }
                                onFocus={() =>
                                    onFocus({
                                        content,
                                        fee,
                                        dispatchTitle,
                                        descriptionTitle,
                                        descriptionList,
                                        descriptionSize
                                    })
                                }
                                onMouseLeave={onMouseLeaveHandler}
                            >
                                {option}
                                {icon}
                            </label>
                            {mobileContent}
                        </div>
                    );
                }
            ),
        [
            activePaymentOption,
            isMobileScreen,
            mobileTitleClass,
            onFocus,
            onMouseLeaveHandler,
            onMouseOverHandler,
            paymentMethodData
        ]
    );

    const defaultPaymentTitleSized = useMemo(() => {
        if (defaultPaymentSize && defaultPaymentSize === 'medium') return <h4>{defaultPaymentTitle}</h4>;
        if (defaultPaymentSize && defaultPaymentSize === 'large') return <h3>{defaultPaymentTitle}</h3>;
        if (defaultPaymentSize && defaultPaymentSize === 'small') return <h5>{defaultPaymentTitle}</h5>;
    }, [defaultPaymentSize, defaultPaymentTitle]);

    const selectedPaymentTitleSized = useMemo(() => {
        if (descriptionSize && descriptionSize === 'medium')
            return (
                <h4>
                    {descriptionTitle} {dispatchTitle}
                </h4>
            );
        if (descriptionSize && descriptionSize === 'large')
            return (
                <h3>
                    {descriptionTitle} {dispatchTitle}
                </h3>
            );
        if (descriptionSize && descriptionSize === 'small')
            return (
                <h5>
                    {descriptionTitle} {dispatchTitle}
                </h5>
            );
    }, [descriptionSize, descriptionTitle, dispatchTitle]);

    if (isLoading) {
        return <CartPaymentShimmer />;
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.descriptionContainer}>
                    <div className={classes.descriptionTitleContainer}>
                        <div>{isMobileScreen ? defaultPaymentTitleSized : selectedPaymentTitleSized}</div>{' '}
                        {lowestPriceLabel}
                    </div>
                    <div>
                        <div className={classes.activeDescription}>
                            {isMobileScreen ? defaultPaymentDescription : activeDescription}
                        </div>
                        {!isMobileScreen && descriptionListItems}
                    </div>
                </div>
                {desktopPaymentHeaderTab}
                <Form onValueChange={handleOptionChange} initialValues={initialValues}>
                    <RadioGroup field="paymentCode">
                        <div className={classes.options}>{paymentOptions}</div>
                    </RadioGroup>
                </Form>
            </div>
        </>
    );
};

CartPayment.propTypes = {
    fetchCartDetails: func,
    setPaymentSelected: func,
    refreshPayment: bool,
    setRefreshPayment: func
};

export default CartPayment;
