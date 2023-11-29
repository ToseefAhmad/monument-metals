export const SCRIPT_ID = 'nmiCollectJs';
export const COLLECT_PATH = '/token/Collect.js';

export const METHOD_CODE = 'aw_nmi';

export const CC_NUM_ID = 'nmi_cc_num';
export const CC_EXP_ID = 'nmi_cc_exp';
export const CC_CVV_ID = 'nmi_cc_cvv';
export const CC_SAVE_ID = 'nmi_cc_save';
export const CC_USE_ID = 'nmi_use_cc';
export const CONFIRM_CC_ID = 'confirm_cc';

export const VAULT_FIELD = 'vault_token';

export const GW_NUM_ID = 'ccnumber';
export const GW_EXP_ID = 'ccexp';
export const GW_CVV_ID = 'cvv';

export const SCRIPT_TOKEN_FIELD = 'data-tokenization-key';

export const COLLECT_CONFIG = {
    variant: 'inline',
    styleSniffer: true,
    fields: {
        ccnumber: {
            placeholder: '4242 4242 4242 4242',
            selector: '#' + CC_NUM_ID
        },
        ccexp: {
            placeholder: 'MM/YY',
            selector: '#' + CC_EXP_ID
        },
        cvv: {
            placeholder: 'CVV',
            selector: '#' + CC_CVV_ID
        }
    }
};

export const VAULT_PLACEHOLDER = {
    key: '0',
    value: '0',
    label: 'Select Credit Card',
    hidden: true
};
