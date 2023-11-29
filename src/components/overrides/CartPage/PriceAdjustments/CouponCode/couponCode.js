import { Form } from 'informed';
import { func } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Remove as RemoveIcon } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import Icon from '@app/components/overrides/Icon';
import LinkButton from '@app/components/overrides/LinkButton';
import TextInput from '@app/components/overrides/TextInput';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './couponCode.module.css';
import { useCouponCode } from './useCouponCode';

/**
 * A child component of the PriceAdjustments component.
 * This component renders a form for addingg a coupon code to the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state for the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [couponCode.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CouponCode from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode";
 */
const CouponCode = ({ setIsCartUpdating }) => {
    const { applyingCoupon, data, errors, handleApplyCoupon, handleRemoveCoupon, removingCoupon } = useCouponCode({
        setIsCartUpdating
    });
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const removeCouponError = deriveErrorMessage([errors.get('removeCouponMutation')]);

    useEffect(() => {
        if (removeCouponError) {
            addToast({
                type: ToastType.ERROR,
                message: removeCouponError,
                timeout: false
            });
        }
    }, [addToast, removeCouponError]);

    const errorMessage = deriveErrorMessage([errors.get('applyCouponMutation')]);

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'coupon.invalidCode',
                    defaultMessage: errorMessage
                }),
                timeout: false
            });
        }
    }, [addToast, errorMessage, formatMessage]);

    if (!data) {
        return null;
    }

    if (errors.get('getAppliedCouponsQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id={'couponCode.errorContainer'}
                    defaultMessage={'Something went wrong. Please refresh and try again.'}
                />
            </div>
        );
    }

    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <div className={classes.removeForm} key={code}>
                    <span>{code}</span>
                    <LinkButton
                        className={classes.removeButton}
                        disabled={removingCoupon}
                        onClick={() => {
                            handleRemoveCoupon(code);
                        }}
                    >
                        <Icon src={RemoveIcon} />
                    </LinkButton>
                </div>
            );
        });

        return <div className={classes.appliedCoupon}>{codes}</div>;
    } else {
        return (
            <Form className={classes.entryForm} onSubmit={handleApplyCoupon}>
                <Field id="couponCode">
                    <TextInput
                        field="couponCode"
                        id={'couponCode'}
                        placeholder="Enter discount code"
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        validate={isRequired}
                    />
                </Field>
                <div className={classes.buttonContainer}>
                    <Button disabled={applyingCoupon} priority="high" type="submit">
                        <span id={'couponCode.apply'}>Apply discount code</span>
                    </Button>
                </div>
            </Form>
        );
    }
};

CouponCode.propTypes = {
    setIsCartUpdating: func.isRequired
};

export default CouponCode;
