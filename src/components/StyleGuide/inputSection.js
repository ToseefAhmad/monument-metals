import { Form } from 'informed';
import React from 'react';

import { Search as SearchIcon } from '@app/components/MonumentIcons';
import Field from '@app/components/overrides/Field';
import Icon from '@app/components/overrides/Icon';
import Select from '@app/components/overrides/Select';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';

import classes from './inputSection.module.css';

const InputSection = () => {
    return (
        <div className={classes.root}>
            <div className={classes.columns}>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Input States</span>
                        <div className={classes.list}>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="input_normal" label="Label">
                                        <TextInput field="input" id="input_normal" placeholder="Placeholder" />
                                    </Field>
                                </Form>
                                <span>Normal</span>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="input_hover" label="Label">
                                        <TextInput field="input" id="input_hover" placeholder="Placeholder" />
                                    </Field>
                                </Form>
                                <span>Hover</span>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="input_focus" label="Label">
                                        <TextInput field="input" id="input_focus" placeholder="Placeholder" />
                                    </Field>
                                </Form>
                                <span>Focus</span>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="input_disabled" label="Label">
                                        <TextInput
                                            field="input"
                                            id="input_disabled"
                                            placeholder="Placeholder"
                                            disabled={true}
                                        />
                                    </Field>
                                </Form>
                                <span>Disabled</span>
                            </div>
                            <div className={classes.item}>
                                <Form>
                                    <Field id="input_error" label="Label">
                                        <TextInput
                                            field="input"
                                            id="input_error"
                                            placeholder="Placeholder"
                                            validateOnMount
                                            validate={() => {
                                                return {
                                                    id: 'styleguide.error',
                                                    defaultMessage: 'Error message'
                                                };
                                            }}
                                        />
                                    </Field>
                                </Form>
                                <span>Error</span>
                            </div>
                        </div>
                    </section>
                </div>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Dropdown</span>
                        <Form>
                            <Field id="dropdown" label="Label">
                                <Select
                                    field="dropdown"
                                    id="dropdown"
                                    items={[
                                        {
                                            key: 's0',
                                            value: 's0',
                                            label: 'Placeholder',
                                            hidden: true
                                        },
                                        { key: 's1', value: 's1', label: 'Select 1' },
                                        { key: 's2', value: 's2', label: 'Select 2' },
                                        { key: 's3', value: 's3', label: 'Select 3' },
                                        { key: 's4', value: 's4', label: 'Select 4', disabled: true },
                                        { key: 's5', value: 's5', label: 'Select 5' },
                                        { key: 's6', value: 's6', label: 'Select 6' },
                                        { key: 's7', value: 's7', label: 'Select 7' },
                                        { key: 's8', value: 's8', label: 'Select 8' }
                                    ]}
                                    placeholder="Placeholder"
                                />
                            </Field>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Text Area</span>
                        <Form>
                            <Field id="review" label="Review" optional={true}>
                                <TextArea field="review" id="review" placeholder="Enter the review" />
                            </Field>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Input Without Label</span>
                        <Form>
                            <Field id="email">
                                <TextInput field="email" id="email" placeholder="E-mail address" />
                            </Field>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Mobile Input</span>
                        <Form>
                            <Field classes={{ label: classes.labelMobile }} id="input_mobile" label="Label">
                                <TextInput
                                    classes={{ input: classes.inputMobile }}
                                    field="input"
                                    id="input_mobile"
                                    placeholder="Placeholder"
                                />
                            </Field>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Search</span>
                        <div className={classes.item}>
                            <Form>
                                <TextInput
                                    classes={{ input: classes.search }}
                                    field="search"
                                    id="search"
                                    placeholder="Search Here..."
                                    after={<Icon src={SearchIcon} />}
                                />
                            </Form>
                            <span>Same states as input (except normal)</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InputSection;
