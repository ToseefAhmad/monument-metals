import React from 'react';

import classes from './errorMessagesSection.module.css';

const ErrorMessagesSection = () => {
    return (
        <div className={classes.root}>
            <section className={classes.section}>
                <span className={classes.subtitle}>Web</span>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Mobile</span>
            </section>
        </div>
    );
};

export default ErrorMessagesSection;
