import { useFormApi } from 'informed';
import { func } from 'prop-types';
import React from 'react';
import { X as ClearIcon } from 'react-feather';

import Icon from '../Icon';

import Trigger from '@magento/venia-ui/lib/components/Trigger';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const formApi = useFormApi();

    const handleReset = () => {
        formApi.reset();

        if (onReset) {
            onReset();
        }
    };

    return <Trigger action={handleReset}>{clearIcon}</Trigger>;
};

export default ResetButton;

ResetButton.propTypes = {
    onReset: func
};
