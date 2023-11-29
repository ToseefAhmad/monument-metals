import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const SUCCESS = undefined;

export const isEmail = value => {
    const FAILURE = {
        id: 'validation.email',
        defaultMessage: 'Valid Email is Required'
    };
    const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!value) return isRequired(value);

    // Check if matches regex
    const measureResult = value.match(EMAIL_REGEX);

    if (!measureResult) return FAILURE;
    return SUCCESS;
};
