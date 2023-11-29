import { string, bool, shape, func } from 'prop-types';
import React from 'react';
import { Eye, EyeOff } from 'react-feather';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { usePassword } from '@magento/peregrine/lib/talons/Password/usePassword';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './password.module.css';

const Password = props => {
    const {
        classes: propClasses,
        label,
        fieldName,
        isToggleButtonHidden,
        autoComplete,
        validate,
        ...otherProps
    } = props;

    const talonProps = usePassword();
    const { handleBlur, togglePasswordVisibility, visible } = talonProps;
    const classes = useStyle(defaultClasses, propClasses);

    const passwordButton = (
        <Button className={classes.passwordButton} onClick={togglePasswordVisibility} type="button">
            {visible ? <Eye /> : <EyeOff />}
        </Button>
    );

    const fieldType = visible ? 'text' : 'password';

    return (
        <Field label={label} id={fieldName}>
            <TextInput
                id={fieldName}
                after={!isToggleButtonHidden && passwordButton}
                autoComplete={autoComplete}
                field={fieldName}
                type={fieldType}
                validate={validate}
                onBlur={handleBlur}
                {...otherProps}
            />
        </Field>
    );
};

Password.propTypes = {
    autoComplete: string,
    classes: shape({
        root: string
    }),
    label: string,
    fieldName: string,
    isToggleButtonHidden: bool,
    validate: func
};

Password.defaultProps = {
    isToggleButtonHidden: true,
    validate: isRequired
};

export default Password;
