export const ACCOUNT_TYPE_CONFIG = [
    {
        key: '0',
        value: '0',
        label: 'Select the account type',
        hidden: true
    },
    {
        key: '1',
        value: 'C',
        label: 'Checking'
    },
    {
        key: '2',
        value: 'S',
        label: 'Savings'
    }
];

export const ACCOUNT_TYPE_MAPPING = {
    C: 'Checking Account',
    S: 'Savings Account'
};

export const ROUTING_FIELD = 'routing_number';
export const ACCOUNT_FIELD = 'account_number';
export const ACCOUNT_FIELD_CONFIRM = 'account_number_confirm';
export const TYPE_FIELD = 'account_type';
export const SAVE_FIELD = 'save_ach';
export const VAULT_USE_FIELD = 'use_vault';

export const METHOD_CODE = 'echeck';

export const VAULT_FIELD = 'vault_token';
export const VAULT_PLACEHOLDER = {
    key: '0',
    value: '0',
    label: 'Select Account',
    hidden: true
};
