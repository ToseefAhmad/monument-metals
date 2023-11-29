import React from 'react';

import classes from './typographySection.module.css';

const TypographySection = () => {
    return (
        <div className={classes.root}>
            <section className={classes.section}>
                <span className={classes.subtitle}>Typeface</span>
                <div className={classes.subSection}>
                    <div className={classes.typeface}>
                        <span className={classes.regular}>Aa</span>
                        <span className={classes.semibold}>Aa</span>
                        <span className={classes.bold}>Aa</span>
                    </div>
                    <p>Proxima nova; Regular; Semibold; Bold</p>
                </div>
            </section>
            <div className={classes.columns}>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Heading / Web</span>
                        <div className={classes.headingWrapper}>
                            <h1 className={classes.heading}>Heading 1</h1>
                            <p>
                                Proxima nova; Semibold; Bold; 38px; 52 line-height; 0 character spacing; #111927 or
                                #FFFFFF
                            </p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h2 className={classes.heading}>Heading 2</h2>
                            <p>Proxima nova; Semibold; 36px; 50 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h3 className={classes.heading}>Heading 3</h3>
                            <p>Proxima nova; Semibold; 24px; 48 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h4 className={classes.heading}>Heading 4</h4>
                            <p>Proxima nova; Semibold; 20px; 34 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h5 className={classes.heading}>Heading 5</h5>
                            <p>
                                Proxima nova; Regular; 18px; 32 line-height; 0 character spacing; #111927/#FFFFFF/66686C
                            </p>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Body / Web</span>
                        <div className={classes.subSection}>
                            <p className={classes.bodyText}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry&apos;s standard dummy text ever since the 1500s.
                            </p>
                            <p>Proxima nova; Regular; 16px; 32 line-height; 0 character spacing; #FFFFFF/66686C</p>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Body Small / Web</span>
                        <div className={classes.subSection}>
                            <p className={classes.bodyTextSmall}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry&apos;s standard dummy text ever since the 1500s.
                            </p>
                            <p>Proxima nova; Regular; 14px; 30 line-height; 0 character spacing; #FFFFFF/66686C</p>
                        </div>
                    </section>
                </div>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Heading / Mobile</span>
                        <div className={classes.headingWrapper}>
                            <h1 className={classes.headingMobile1}>Heading 1</h1>
                            <p>
                                Proxima nova; Semibold; Bold; 28px; 42 line-height; 0 character spacing; #111927 or
                                #FFFFFF
                            </p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h2 className={classes.headingMobile2}>Heading 2</h2>
                            <p>Proxima nova; Semibold; 26px; 40 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h3 className={classes.headingMobile3}>Heading 3</h3>
                            <p>Proxima nova; Semibold; 20px; 34 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h4 className={classes.headingMobile4}>Heading 4</h4>
                            <p>Proxima nova; Semibold; 16px; 32 line-height; 0 character spacing; #111927 or #FFFFFF</p>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h5 className={classes.headingMobile5}>Heading 5</h5>
                            <p>
                                Proxima nova; Regular; 14px; 30 line-height; 0 character spacing; #111927/#FFFFFF/66686C
                            </p>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Body / Mobile</span>
                        <div className={classes.subSection}>
                            <p className={classes.bodyMobileText}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry&apos;s standard dummy text ever since the 1500s.
                            </p>
                            <p>Proxima nova; Regular; 14px; 30 line-height; 0 character spacing; #FFFFFF/66686C</p>
                        </div>
                    </section>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Body Small / Mobile</span>
                        <div className={classes.subSection}>
                            <p className={classes.bodyMobileTextSmall}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry&apos;s standard dummy text ever since the 1500s.
                            </p>
                            <p>Proxima nova; Regular; 12px; 20 line-height; 0 character spacing; #FFFFFF/66686C</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TypographySection;
