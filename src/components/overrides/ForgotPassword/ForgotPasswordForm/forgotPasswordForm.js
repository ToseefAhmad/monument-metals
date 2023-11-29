import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './forgotPasswordForm.module.css';

const ForgotPasswordForm = ({ initialValues, isResettingPassword, onSubmit, onCancel, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();

    return (
        <Form className={classes.root} initialValues={initialValues} onSubmit={onSubmit}>
            <Field
                label={formatMessage({
                    id: 'forgotPasswordForm.email',
                    defaultMessage: 'E-mail'
                })}
                id="email"
            >
                <TextInput
                    autoComplete="email"
                    field="email"
                    id="email"
                    validate={isRequired}
                    placeholder={formatMessage({
                        id: 'forgotPasswordForm.placeholder',
                        defaultMessage: 'Enter the e-mail'
                    })}
                />
            </Field>
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.cancelButton}
                    disabled={isResettingPassword}
                    type="button"
                    priority="low"
                    onClick={onCancel}
                >
                    <FormattedMessage id={'forgotPasswordForm.cancelButtonText'} defaultMessage={'Cancel'} />
                </Button>
                <Button className={classes.submitButton} disabled={isResettingPassword} type="submit" priority="high">
                    <FormattedMessage id={'forgotPasswordForm.submitButtonText'} defaultMessage={'Submit'} />
                </Button>
            </div>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func.isRequired,
    onSubmit: func.isRequired,
    isResettingPassword: bool
};

ForgotPasswordForm.defaultProps = {
    initialValues: {}
};

export default ForgotPasswordForm;
