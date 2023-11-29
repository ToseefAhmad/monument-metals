import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock';
import Field from '@magento/venia-ui/lib/components/Field';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './newsletter.module.css';
import { useNewsletter } from './useNewsletter';

const Newsletter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useNewsletter();
    const { handleSubmit, isBusy, setFormApi } = talonProps;

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id={'newsletter.loadingText'} defaultMessage={'Subscribing'} />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            {maybeLoadingIndicator}
            <CmsBlockGroup
                identifiers="newsletter"
                classes={{
                    root: '',
                    content: classes.content
                }}
            />
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field id="email" optional={true}>
                    <TextInput
                        autoComplete="off"
                        field="email"
                        id="email"
                        placeholder="E-mail address"
                        validate={isRequired}
                        classes={{ input: classes.emailInput, input_error: classes.emailInput_error }}
                    />
                </Field>

                <Button priority="normal" type="submit" disabled={isBusy} className={classes.button}>
                    <FormattedMessage id={'newsletter.subscribeText'} defaultMessage={'Sign up'} />
                </Button>
            </Form>
        </div>
    );
};

Newsletter.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        form: string,
        buttonsContainer: string
    })
};

export default Newsletter;
