import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const SUCCESS = undefined;

export const isPrice = value => {
    const FAILURE = {
        id: 'validation.price',
        defaultMessage: 'Valid price is required'
    };
    const PRICE_REGEX = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.\d*)?$/;
    if (!value) return isRequired(value);

    // Check if matches regex
    const measureResult = value.match(PRICE_REGEX);

    if (!measureResult) return FAILURE;
    return SUCCESS;
};
