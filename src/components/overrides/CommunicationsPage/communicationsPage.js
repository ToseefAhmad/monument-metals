import { Form } from 'informed';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import FormError from '@app/components/overrides/FormError';
import { useToasts } from '@magento/peregrine';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/CommunicationsPage/useCommunicationsPage';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './communicationsPage.module.css';

const CommunicationsPage = () => {
    const { formatMessage } = useIntl();

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'communicationsPage.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);

    const talonProps = useCommunicationsPage({ afterSubmit });

    const { formErrors, handleSubmit, initialValues, isDisabled } = talonProps;

    const isSubscribed = initialValues ? initialValues.isSubscribed : false;

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }
    const title = formatMessage({
        id: 'communicationsPage.mainTitle',
        defaultMessage: 'Newsletter'
    });

    const button = !isSubscribed ? (
        <Button disabled={isDisabled} type="submit" priority="normal">
            {isDisabled
                ? formatMessage({
                      id: 'communicationsPage.savingText',
                      defaultMessage: 'Saving'
                  })
                : formatMessage({
                      id: 'communicationsPage.changesText',
                      defaultMessage: 'Save Changes'
                  })}
        </Button>
    ) : null;

    return (
        <AccountPageWrapper pageTitle={title}>
            <div className={classes.root}>
                <StoreTitle>{title}</StoreTitle>
                <p className={classes.secondaryTittle}>
                    <FormattedMessage
                        id={'communicationsPage.optInText'}
                        defaultMessage={
                            "We'd like to stay in touch. Please check the boxes next to the communications you'd like to receive."
                        }
                    />
                </p>
                <FormError errors={formErrors} />
                <Form className={classes.form} onSubmit={handleSubmit} initialValues={initialValues}>
                    <Field
                        id="isSubscribed"
                        label={formatMessage({
                            id: 'communicationsPage.newsletterText',
                            defaultMessage: 'Monument Metals Newsletter'
                        })}
                    >
                        <div className={classes.checkboxBlock}>
                            <Checkbox
                                disabled={isSubscribed}
                                field="isSubscribed"
                                label={formatMessage({
                                    id: 'communicationsPage.subscriptionText',
                                    defaultMessage:
                                        'Stay on the cutting edge of Precious Metals news, price news, and more; subscribe to our newsletter.'
                                })}
                            />
                        </div>
                    </Field>
                    <div className={classes.buttonsContainer}>{button}</div>
                </Form>
            </div>
        </AccountPageWrapper>
    );
};

export default CommunicationsPage;
