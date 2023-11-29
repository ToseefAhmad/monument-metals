import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import Button from '@app/components/overrides/Button';
import CmsBlockGroup from '@app/components/overrides/CmsBlock';
import Field from '@app/components/overrides/Field';
import { Meta, Heading, StoreTitle, OgMeta } from '@app/components/overrides/Head';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';
import { validatePhoneNumber } from '@app/util/formValidators';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './contactUs.module.css';
import { isEmail } from './emailValidation';
import { useContactUs } from './useContactUs';

const ContactUs = () => {
    const { handleSubmit, isBusy, setFormApi } = useContactUs();

    useEffect(() => {
        document.body.classList.add('contact-us');

        return () => document.body.classList.remove('contact-us');
    }, []);

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id={'contactUs.loadingText'} defaultMessage={'Sending your Message'} />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <>
            <StoreTitle>Contact Us</StoreTitle>
            <Meta name="title" content="Contact Us" />
            <Meta
                name="description"
                content="Monument Metals is dedicated to your satisfaction as a customer. If you have any questions or concerns regarding an existing or potential order, we can be reached via email at support@monumentmetals.com and by phone at 800-974-3121."
            />
            <OgMeta property="og:title" content="Contact Us" />
            <OgMeta
                property="og:description"
                content="Monument Metals is dedicated to your satisfaction as a customer. If you have any questions or concerns regarding an existing or potential order, we can be reached via email at support@monumentmetals.com and by phone at 800-974-3121."
            />
            <OgMeta property="og:type" content="website" />
            <Meta name="keywords" content="Silver Coins, Gold Coins" />
            <div className={classes.root}>
                <Heading>
                    <FormattedMessage id={'contactUs.heading'} defaultMessage={'Contact Us'} />
                </Heading>
                <Breadcrumbs staticPage={'Contact Us'} />
                {maybeLoadingIndicator}
                <CmsBlockGroup
                    identifiers="contact-us"
                    classes={{
                        root: classes.contactTextWrapper,
                        content: classes.content
                    }}
                />
                <div>
                    <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                        <div className={classes.item}>
                            <Field id="name" label="Name">
                                <TextInput
                                    autoComplete="name"
                                    field="name"
                                    id="name"
                                    placeholder="Your Name"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>

                        <div className={classes.item}>
                            <Field id="email" label="Email">
                                <TextInput
                                    autoComplete="email"
                                    field="email"
                                    id="email"
                                    placeholder="E-mail address"
                                    validate={isEmail}
                                />
                            </Field>
                        </div>
                        <div className={classes.item}>
                            <Field id="phone" optional={true} label="Phone">
                                <TextInput
                                    validateOnChange
                                    autoComplete="phone"
                                    inputMode="numeric"
                                    field="phone"
                                    id="phone"
                                    maxLength={15}
                                    validate={validatePhoneNumber}
                                />
                            </Field>
                        </div>
                        <div className={classes.item}>
                            <Field id="message" label="Whats on your mind">
                                <TextArea autoComplete="message" field="message" id="message" validate={isRequired} />
                            </Field>
                        </div>
                        <div className={classes.buttonWrapper}>
                            <Button priority="normal" type="submit" disabled={isBusy}>
                                <FormattedMessage id={'contactUs.subscribeText'} defaultMessage={'Write Us'} />
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

ContactUs.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        form: string,
        buttonsContainer: string
    })
};

export default ContactUs;
