import classnames from 'classnames';
import { Form } from 'informed';
import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight as ArrowRightIcon, Breadcrumb as BreadcrumbIcon } from '@app/components/MonumentIcons';
import Checkbox from '@app/components/overrides/Checkbox';
import RadioGroup from '@app/components/overrides/RadioGroup';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './elementsSection.module.css';

const ElementsSection = () => {
    return (
        <div className={classes.root}>
            <div className={classes.columns}>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Checkmarks</span>
                        <Form>
                            <div className={classes.checkboxList}>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkmark" field="checkbox" />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkmark / Active" field="checkbox-active" initialValue={true} />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkmark / Disabled" field="checkbox-disabled" disabled={true} />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox
                                        label="Checkmark / Active / Disabled"
                                        field="checkbox-disabled-active"
                                        initialValue={true}
                                        disabled={true}
                                    />
                                </div>
                                <div className={classes.checkboxItem}>
                                    <Checkbox label="Checkmark / Mobile" field="checkbox-mobile" />
                                </div>
                            </div>
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Links</span>
                        <div className={classes.linksColumns}>
                            <div className={classes.linksColumn}>
                                <Link to="#">Link</Link>
                                <Link className={classes.linkMobile} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksText}>Normal</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkHover} to="#">
                                    Link
                                </Link>
                                <Link className={classnames(classes.linkHover, classes.linkMobile)} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksText}>Hover</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkFocus} to="#">
                                    Link
                                </Link>
                                <Link className={classnames(classes.linkFocus, classes.linkMobile)} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksText}>Pressed</span>
                            </div>
                        </div>
                        <div className={classes.linksColumns}>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkSecondary} to="#">
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <Link className={classes.linkSecondaryMobile} to="#">
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <span className={classes.linksText}>Normal</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkSecondaryHover} to="#">
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <Link
                                    className={classnames(classes.linkSecondaryHover, classes.linkSecondaryMobile)}
                                    to="#"
                                >
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <span className={classes.linksText}>Hover</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkSecondaryFocus} to="#">
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <Link
                                    className={classnames(classes.linkSecondaryFocus, classes.linkSecondaryMobile)}
                                    to="#"
                                >
                                    Shop now
                                    <Icon src={ArrowRightIcon} classes={{ root: classes.linkSecondaryIcon }} />
                                </Link>
                                <span className={classes.linksText}>Pressed</span>
                            </div>
                        </div>
                        <div className={classes.linksColumnsDark}>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkLight} to="#">
                                    Link
                                </Link>
                                <Link className={classes.linkLightMobile} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksTextLight}>Normal</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkLightHover} to="#">
                                    Link
                                </Link>
                                <Link className={classnames(classes.linkLightHover, classes.linkLightMobile)} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksTextLight}>Hover</span>
                            </div>
                            <div className={classes.linksColumn}>
                                <Link className={classes.linkLightFocus} to="#">
                                    Link
                                </Link>
                                <Link className={classnames(classes.linkLightFocus, classes.linkLightMobile)} to="#">
                                    Link
                                </Link>
                                <span className={classes.linksTextLight}>Pressed</span>
                            </div>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Numbered List</span>
                        <ul className={classes.numberedList}>
                            <li className={classes.numberedItem}>Sed a ante sed metus iaculis luctus.</li>
                            <li className={classes.numberedItem}>Nam mattis ipsum sed hendrerit lobortis.</li>
                            <li className={classes.numberedItem}>
                                Nam eleifend neque vitae velit maximus, mattis suscipit metus laoreet.
                            </li>
                            <li className={classes.numberedItem}>
                                Nam at ipsum id eros fermentum tincidunt ut in arcu.
                            </li>
                        </ul>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Numbered List / Mobile</span>
                        <ul className={classes.numberedListMobile}>
                            <li className={classes.numberedItemMobile}>Sed a ante sed metus iaculis luctus.</li>
                            <li className={classes.numberedItemMobile}>Nam mattis ipsum sed hendrerit lobortis.</li>
                            <li className={classes.numberedItemMobile}>
                                Nam eleifend neque vitae velit maximus, mattis suscipit metus laoreet.
                            </li>
                            <li className={classes.numberedItemMobile}>
                                Nam at ipsum id eros fermentum tincidunt ut in arcu.
                            </li>
                        </ul>
                    </section>
                </div>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Radio Buttons</span>
                        <Form>
                            <RadioGroup
                                classes={{ root: classes.radioGroup }}
                                field="radio"
                                id={'radio'}
                                initialValue="r2"
                                items={[
                                    {
                                        key: 'r1',
                                        value: 'r1',
                                        label: 'Radio button'
                                    },
                                    {
                                        key: 'r2',
                                        value: 'r2',
                                        label: 'Radio button / Active'
                                    }
                                ]}
                            />
                            <RadioGroup
                                classes={{ root: classes.radioGroup }}
                                disabled={true}
                                field="radio-disabled"
                                id={'radio-disabled'}
                                initialValue="r2"
                                items={[
                                    {
                                        key: 'r1',
                                        value: 'r1',
                                        label: 'Radio button / Disabled'
                                    },
                                    {
                                        key: 'r2',
                                        value: 'r2',
                                        label: 'Radio button / Active / Disabled'
                                    }
                                ]}
                            />
                            <RadioGroup
                                classes={{
                                    root: classes.radioGroup,
                                    radioLabel: classes.radioLabelMobile,
                                    radioContainer: classes.radioContainerMobile,
                                    radioContainer_active: classes.radioContainerActiveMobile
                                }}
                                field="radio-mobile"
                                id={'radio-mobile'}
                                initialValue="r2"
                                items={[
                                    {
                                        key: 'r1',
                                        value: 'r1',
                                        label: 'Radio button / Mobile'
                                    }
                                ]}
                            />
                        </Form>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>List</span>
                        <ul className={classes.unorderedList}>
                            <li className={classes.unorderedItem}>Sed a ante sed metus iaculis luctus.</li>
                            <li className={classes.unorderedItem}>Nam mattis ipsum sed hendrerit lobortis.</li>
                            <li className={classes.unorderedItem}>
                                Nam eleifend neque vitae velit maximus, mattis suscipit metus laoreet.
                            </li>
                            <li className={classes.unorderedItem}>
                                Nam at ipsum id eros fermentum tincidunt ut in arcu.
                            </li>
                        </ul>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>List / Mobile</span>
                        <ul className={classes.unorderedListMobile}>
                            <li className={classes.unorderedItemMobile}>Sed a ante sed metus iaculis luctus.</li>
                            <li className={classes.unorderedItemMobile}>Nam mattis ipsum sed hendrerit lobortis.</li>
                            <li className={classes.unorderedItemMobile}>
                                Nam eleifend neque vitae velit maximus, mattis suscipit metus laoreet.
                            </li>
                            <li className={classes.unorderedItemMobile}>
                                Nam at ipsum id eros fermentum tincidunt ut in arcu.
                            </li>
                        </ul>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Breadcrumbs</span>
                        <div className={classes.breadcrumbs}>
                            <Link className={classes.breadcrumbsLink} to="#">
                                Link
                            </Link>
                            <span className={classes.breadcrumbsDivider}>
                                <Icon src={BreadcrumbIcon} />
                            </span>
                            <Link className={classes.breadcrumbsLinkHover} to="#">
                                Link Hover
                            </Link>
                            <span className={classes.breadcrumbsDivider}>
                                <Icon src={BreadcrumbIcon} />
                            </span>
                            <span className={classes.breadcrumbsText}>Link Active</span>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Labels</span>
                        <div className={classes.labelsList}>
                            <span className={classes.labelDanger}>Out of Stock</span>
                            <span className={classes.labelSuccess}>Sale</span>
                            <span className={classes.labelWarning}>Pre-Order</span>
                        </div>
                        <div className={classes.labelsList}>
                            <span className={classes.labelDangerMobile}>Out of Stock</span>
                            <span className={classes.labelSuccessMobile}>Sale</span>
                            <span className={classes.labelWarningMobile}>Pre-Order</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ElementsSection;
