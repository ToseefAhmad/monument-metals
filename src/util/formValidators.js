import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */

const SUCCESS = undefined;

export const validatePhoneNumber = value => {
    const pattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
    const message = {
        id: 'validation.invalidPhoneNumber',
        defaultMessage: 'Invalid phone number.'
    };

    if (!pattern.test(value)) {
        return message;
    }

    if (value.length <= 5) {
        return message;
    }

    return SUCCESS;
};

export const validatePhoneNumberRequired = value => {
    return isRequired(value) || validatePhoneNumber(value);
};
