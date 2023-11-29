import { shape, string, bool, array, func, object } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import FormError from '../FormError';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';

import EditForm from './editForm';
import defaultClasses from './editModal.module.css';

const EditModal = props => {
    const {
        classes: propClasses,
        formErrors,
        onCancel,
        onChangePassword,
        onSubmit,
        initialValues,
        isDisabled,
        isOpen,
        shouldShowNewPassword,
        showPassword,
        setShowPassword
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    return (
        <Dialog
            classes={{ dialog: classes.editAccountInformationModal, body: classes.bodyEditAccountInformation }}
            confirmText={'Save'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            shouldUnmountOnHide={true}
            title={formatMessage({
                id: 'accountInformationPage.editAccount',
                defaultMessage: 'Edit Account Information'
            })}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={formErrors} />
            <EditForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleChangePassword={onChangePassword}
                shouldShowNewPassword={shouldShowNewPassword}
                customer={initialValues}
            />
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    formErrors: array,
    handleCancel: func,
    handleSubmit: func,
    initialValues: object,
    isDisabled: bool,
    isOpen: bool,
    onCancel: func,
    onChangePassword: func,
    onSubmit: func,
    shouldShowNewPassword: bool,
    showPassword: bool,
    setShowPassword: func.isRequired
};
