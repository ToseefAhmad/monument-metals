const SUCCESS = undefined;

export const routingValid = value => {
    const INVALID = {
        id: 'validation.isRouting',
        defaultMessage: 'Valid routing number is required.'
    };

    if (value.length !== 9) {
        return {
            id: 'validation.isRoutingDigitCount',
            defaultMessage: 'Valid routing number is required. MUST be 9 digits.'
        };
    }

    // http://en.wikipedia.org/wiki/Routing_transit_number#MICR_Routing_number_format
    const checksumTotal =
        7 * (parseInt(value.charAt(0), 10) + parseInt(value.charAt(3), 10) + parseInt(value.charAt(6), 10)) +
        3 * (parseInt(value.charAt(1), 10) + parseInt(value.charAt(4), 10) + parseInt(value.charAt(7), 10)) +
        9 * (parseInt(value.charAt(2), 10) + parseInt(value.charAt(5), 10) + parseInt(value.charAt(8), 10));

    const checksumMod = checksumTotal % 10;
    if (checksumMod !== 0) {
        return INVALID;
    }

    return SUCCESS;
};

export const validatePaste = (forbidenChar, e) => {
    var pasteData = e.clipboardData.getData('text');
    const pasteDataToArray = pasteData.split('');
    if (pasteDataToArray.includes(forbidenChar)) {
        e.preventDefault();
    }
};

export const validateConfirmPaste = e => {
    e.preventDefault();
};

export const isNumber = value => {
    const INVALID = {
        id: 'validation.isNumber',
        defaultMessage: 'Entry must be a numeric value.'
    };

    const pattern = /^[0-9\b]+$/;

    if (pattern.test(value)) {
        return SUCCESS;
    }

    return INVALID;
};

export const isEqualToAccount = (value, values, fieldKey) => {
    const message = {
        id: 'validation.accountMatch',
        defaultMessage: 'Account fields must match'
    };
    return value === values[fieldKey] ? SUCCESS : message;
};
