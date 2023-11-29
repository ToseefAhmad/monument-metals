import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAccountInformationPage = props => {
    const {
        mutations: { setCustomerInformationMutation, changeCustomerPasswordMutation },
        queries: { getCustomerInformationQuery },
        showPassword
    } = props;

    const [, { addToast }] = useToasts();

    const { formatMessage } = useIntl();

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);

    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(getCustomerInformationQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        setCustomerInformation,
        { error: customerInformationUpdateError, loading: isUpdatingCustomerInformation }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        { error: customerPasswordChangeError, loading: isChangingCustomerPassword }
    ] = useMutation(changeCustomerPasswordMutation);

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, password, newPassword }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = showPassword || shouldShowNewPassword ? password.trim() : 'mockupPassword';
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                // You must send password because it is required
                                // when changing email.
                                password
                            }
                        }
                    });
                    if (!customerInformationUpdateError) {
                        addToast({
                            type: ToastType.SUCCESS,
                            message: formatMessage({
                                id: 'accountInformationPage.infoChangeSuccess',
                                defaultMessage: 'You have successfully updated your account information'
                            })
                        });
                    } else {
                        addToast({
                            type: ToastType.ERROR,
                            message: formatMessage({
                                id: 'accountInformationPage.infoChangeError',
                                defaultMessage: 'Something went wrong, please try again'
                            })
                        });
                    }
                }
                if (password && newPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        }
                    });

                    if (!customerPasswordChangeError) {
                        addToast({
                            type: ToastType.SUCCESS,
                            message: formatMessage({
                                id: 'accountInformationPage.passwordChangeSuccess',
                                defaultMessage: 'You have successfully changed your password'
                            })
                        });
                    } else {
                        addToast({
                            type: ToastType.ERROR,
                            message: formatMessage({
                                id: 'accountInformationPage.passwordChangeError',
                                defaultMessage: 'Something went wrong, please try again'
                            })
                        });
                    }
                }
                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);

                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [
            setCustomerInformation,
            handleCancel,
            changeCustomerPassword,
            initialValues,
            showPassword,
            addToast,
            formatMessage,
            customerInformationUpdateError,
            customerPasswordChangeError,
            shouldShowNewPassword
        ]
    );

    const errors = displayError ? [customerInformationUpdateError, customerPasswordChangeError] : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    };
};