import React from 'react';

import {
    ArrowRight,
    ArrowLeft,
    ArrowLargeRight,
    ArrowLargeLeft,
    Facebook,
    Instagram,
    Twitter,
    Reddit
} from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';

import classes from './buttonsSection.module.css';

const ButtonsSection = () => {
    return (
        <div className={classes.root}>
            <section className={classes.section}>
                <span className={classes.subtitle}>Primary Button</span>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <Button priority="normal">Button</Button>
                        <span>Normal</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="normal" classes={{ root_normalPriority: classes.normalPriorityHover }}>
                            Button
                        </Button>
                        <span>Hover</span>
                    </div>
                    <div className={classes.item}>
                        <Button
                            priority="normal"
                            classes={{
                                root_normalPriority: classes.normalPriorityPressed
                            }}
                        >
                            Button
                        </Button>
                        <span>Pressed</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="normal" disabled={true}>
                            Button
                        </Button>
                        <span>Disabled</span>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Secondary Button</span>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <Button priority="high">Button</Button>
                        <span>Normal</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="high" classes={{ root_highPriority: classes.highPriorityHover }}>
                            Button
                        </Button>
                        <span>Hover</span>
                    </div>
                    <div className={classes.item}>
                        <Button
                            priority="high"
                            classes={{
                                root_highPriority: classes.highPriorityPressed
                            }}
                        >
                            Button
                        </Button>
                        <span>Pressed</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="high" disabled={true}>
                            Button
                        </Button>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Outlined Button</span>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <Button priority="low">Button</Button>
                        <span>Normal</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="low" classes={{ root_lowPriority: classes.lowPriorityHover }}>
                            Button
                        </Button>
                        <span>Hover</span>
                    </div>
                    <div className={classes.item}>
                        <Button
                            priority="low"
                            classes={{
                                root_lowPriority: classes.lowPriorityPressed
                            }}
                        >
                            Button
                        </Button>
                        <span>Pressed</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="low" disabled={true}>
                            Button
                        </Button>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Arrows</span>
                <div className={classes.arrowColumns}>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButton }}>
                            <Icon src={ArrowRight} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButton }}>
                            <Icon src={ArrowLeft} />
                        </Button>
                        <span>Normal</span>
                    </div>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonHover }}>
                            <Icon src={ArrowRight} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonHover }}>
                            <Icon src={ArrowLeft} />
                        </Button>
                        <span>Hover</span>
                    </div>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonFocus }}>
                            <Icon src={ArrowRight} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonFocus }}>
                            <Icon src={ArrowLeft} />
                        </Button>
                        <span>Pressed</span>
                    </div>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButton }} disabled={true}>
                            <Icon src={ArrowRight} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButton }} disabled={true}>
                            <Icon src={ArrowLeft} />
                        </Button>
                        <span>Disabled</span>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Other Buttons</span>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <Button size="small">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58167 12.4183 0 8 0C3.58173 0 0 3.58167 0 8C0 12.4183 3.58173 16 8 16ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68628 11.3137 2 8 2C4.68628 2 2 4.68628 2 8C2 11.3137 4.68628 14 8 14ZM7 5C7 4.44775 7.44769 4 8 4C8.55231 4 9 4.44775 9 5C9 5.55225 8.55231 6 8 6C7.44769 6 7 5.55225 7 5ZM8 7C7.44769 7 7 7.44775 7 8V11C7 11.5522 7.44769 12 8 12C8.55231 12 9 11.5522 9 11V8C9 7.44775 8.55231 7 8 7Z"
                                    fill="white"
                                />
                            </svg>
                            Add Market Alert
                        </Button>
                        <span>Same states as primary button</span>
                    </div>
                    <div className={classes.item}>
                        <Button priority="alert" size="small">
                            <span className={classes.buttonIcon}>
                                <svg
                                    width="10"
                                    height="16"
                                    viewBox="0 0 10 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 1C6 0.447715 5.55228 0 5 0C4.44772 0 4 0.447715 4 1V2.54541H3.33333C2.4639 2.54541 1.62125 2.87466 0.992942 3.47441C0.36305 4.07567 0 4.90135 0 5.77268C0 6.64402 0.36305 7.4697 0.992942 8.07096C1.62125 8.67071 2.4639 8.99996 3.33333 8.99996H4V11.4545H1C0.447715 11.4545 0 11.9022 0 12.4545C0 13.0068 0.447715 13.4545 1 13.4545H4V15C4 15.5523 4.44772 16 5 16C5.55228 16 6 15.5523 6 15V13.4545H6.66667C7.5361 13.4545 8.37875 13.1253 9.00706 12.5255C9.63695 11.9242 10 11.0986 10 10.2272C10 9.3559 9.63695 8.53021 9.00706 7.92895C8.37875 7.3292 7.5361 6.99996 6.66667 6.99996H6V4.54541H8.33333C8.88562 4.54541 9.33333 4.09769 9.33333 3.54541C9.33333 2.99313 8.88562 2.54541 8.33333 2.54541H6V1ZM4 4.54541H3.33333C2.96509 4.54541 2.62075 4.68548 2.37389 4.92112C2.12862 5.15525 2 5.4626 2 5.77268C2 6.08277 2.12862 6.39012 2.37389 6.62425C2.62075 6.85988 2.96509 6.99996 3.33333 6.99996H4V4.54541ZM6 8.99996V11.4545H6.66667C7.03491 11.4545 7.37925 11.3144 7.62611 11.0788C7.87138 10.8447 8 10.5373 8 10.2272C8 9.91714 7.87138 9.60979 7.62611 9.37566C7.37925 9.14003 7.03491 8.99996 6.66667 8.99996H6Z"
                                        fill="white"
                                    />
                                </svg>
                            </span>
                            Add Price Alert
                        </Button>
                        <span>Same states as arrows (except normal state)</span>
                    </div>
                </div>
                <div className={classes.smallArrowColumns}>
                    <div className={classes.smallArrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButton }}>
                            <Icon src={ArrowLargeLeft} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButton }}>
                            <Icon src={ArrowLargeRight} />
                        </Button>
                        <span>Normal</span>
                    </div>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButtonHover }}>
                            <Icon src={ArrowLargeLeft} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButtonHover }}>
                            <Icon src={ArrowLargeRight} />
                        </Button>
                        <span>Hover</span>
                    </div>
                    <div className={classes.arrowColumn}>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButtonFocus }}>
                            <Icon src={ArrowLargeLeft} />
                        </Button>
                        <Button priority="low" classes={{ root_lowPriority: classes.smallArrowButtonFocus }}>
                            <Icon src={ArrowLargeRight} />
                        </Button>
                        <span>Pressed</span>
                    </div>
                </div>
                <div className={classes.darkWrapper}>
                    <div className={classes.list}>
                        <div className={classes.item}>
                            <Button priority="low" classes={{ root_lowPriority: classes.shopAlertButton }}>
                                Shop now
                            </Button>
                            <span className={classes.lightText}>Same states as arrows</span>
                        </div>
                        <div className={classes.item}>
                            <Button priority="low" classes={{ root_lowPriority: classes.shopNormalButton }}>
                                Shop now
                            </Button>
                            <span className={classes.lightText}>Same states as outlined button</span>
                        </div>
                    </div>
                    <div className={classes.socialLinkColumns}>
                        <div className={classes.socialLinkColumn}>
                            <a
                                className={classes.socialLink}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Facebook} />
                            </a>
                            <a
                                className={classes.socialLink}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Instagram} />
                            </a>
                            <a
                                className={classes.socialLink}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Twitter} />
                            </a>
                            <a
                                className={classes.socialLink}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Reddit} />
                            </a>
                            <span className={classes.lightTextSocial}>Normal</span>
                        </div>
                        <div className={classes.socialLinkColumn}>
                            <a
                                className={classes.socialLinkHover}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Facebook} />
                            </a>
                            <a
                                className={classes.socialLinkHover}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Instagram} />
                            </a>
                            <a
                                className={classes.socialLinkHover}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Twitter} />
                            </a>
                            <a
                                className={classes.socialLinkHover}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Reddit} />
                            </a>
                            <span className={classes.lightTextSocial}>Hover</span>
                        </div>
                        <div className={classes.socialLinkColumn}>
                            <a
                                className={classes.socialLinkFocus}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Facebook} />
                            </a>
                            <a
                                className={classes.socialLinkFocus}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Instagram} />
                            </a>
                            <a
                                className={classes.socialLinkFocus}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Twitter} />
                            </a>
                            <a
                                className={classes.socialLinkFocus}
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon src={Reddit} />
                            </a>
                            <span className={classes.lightTextSocial}>Pressed</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Mobile Buttons</span>
                <div className={classes.mobileButtonsList}>
                    <div className={classes.item}>
                        <Button classes={{ root_normalPriority: classes.normalPriorityMobile }}>Button</Button>
                    </div>
                    <div className={classes.item}>
                        <Button priority="high" classes={{ root_highPriority: classes.highPriorityMobile }}>
                            Button
                        </Button>
                    </div>
                    <div className={classes.item}>
                        <Button priority="low" classes={{ root_lowPriority: classes.lowPriorityMobile }}>
                            Button
                        </Button>
                    </div>
                </div>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonMobile }}>
                            <Icon src={ArrowLeft} />
                        </Button>
                    </div>
                    <div className={classes.item}>
                        <Button priority="low" classes={{ root_lowPriority: classes.arrowButtonMobile }}>
                            <Icon src={ArrowRight} />
                        </Button>
                    </div>
                    <div className={classes.item}>
                        <Button size="small" classes={{ root_normalPrioritySmall: classes.normalPrioritySmallMobile }}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58167 12.4183 0 8 0C3.58173 0 0 3.58167 0 8C0 12.4183 3.58173 16 8 16ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68628 11.3137 2 8 2C4.68628 2 2 4.68628 2 8C2 11.3137 4.68628 14 8 14ZM7 5C7 4.44775 7.44769 4 8 4C8.55231 4 9 4.44775 9 5C9 5.55225 8.55231 6 8 6C7.44769 6 7 5.55225 7 5ZM8 7C7.44769 7 7 7.44775 7 8V11C7 11.5522 7.44769 12 8 12C8.55231 12 9 11.5522 9 11V8C9 7.44775 8.55231 7 8 7Z"
                                    fill="white"
                                />
                            </svg>
                            Add Market Alert
                        </Button>
                    </div>
                    <div className={classes.item}>
                        <Button
                            priority="alert"
                            size="small"
                            classes={{ root_alertPrioritySmall: classes.alertPrioritySmallMobile }}
                        >
                            <span className={classes.buttonIcon}>
                                <svg
                                    width="10"
                                    height="16"
                                    viewBox="0 0 10 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 1C6 0.447715 5.55228 0 5 0C4.44772 0 4 0.447715 4 1V2.54541H3.33333C2.4639 2.54541 1.62125 2.87466 0.992942 3.47441C0.36305 4.07567 0 4.90135 0 5.77268C0 6.64402 0.36305 7.4697 0.992942 8.07096C1.62125 8.67071 2.4639 8.99996 3.33333 8.99996H4V11.4545H1C0.447715 11.4545 0 11.9022 0 12.4545C0 13.0068 0.447715 13.4545 1 13.4545H4V15C4 15.5523 4.44772 16 5 16C5.55228 16 6 15.5523 6 15V13.4545H6.66667C7.5361 13.4545 8.37875 13.1253 9.00706 12.5255C9.63695 11.9242 10 11.0986 10 10.2272C10 9.3559 9.63695 8.53021 9.00706 7.92895C8.37875 7.3292 7.5361 6.99996 6.66667 6.99996H6V4.54541H8.33333C8.88562 4.54541 9.33333 4.09769 9.33333 3.54541C9.33333 2.99313 8.88562 2.54541 8.33333 2.54541H6V1ZM4 4.54541H3.33333C2.96509 4.54541 2.62075 4.68548 2.37389 4.92112C2.12862 5.15525 2 5.4626 2 5.77268C2 6.08277 2.12862 6.39012 2.37389 6.62425C2.62075 6.85988 2.96509 6.99996 3.33333 6.99996H4V4.54541ZM6 8.99996V11.4545H6.66667C7.03491 11.4545 7.37925 11.3144 7.62611 11.0788C7.87138 10.8447 8 10.5373 8 10.2272C8 9.91714 7.87138 9.60979 7.62611 9.37566C7.37925 9.14003 7.03491 8.99996 6.66667 8.99996H6Z"
                                        fill="white"
                                    />
                                </svg>
                            </span>
                            Add Price Alert
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ButtonsSection;
