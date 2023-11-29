import { Text as InformedText } from 'informed';
import { node, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';

import defaultClasses from './textInput.module.css';

const TextInput = props => {
    const { after, before, classes: propClasses, field, message, ...rest } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    return (
        <Fragment>
            <Message classes={{ root_error: classes.messageRoot }} fieldState={fieldState}>
                {message}
            </Message>
            <FieldIcons after={after} before={before}>
                <InformedText {...rest} className={inputClass} field={field} />
            </FieldIcons>
        </Fragment>
    );
};

export default TextInput;

TextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    message: node
};
