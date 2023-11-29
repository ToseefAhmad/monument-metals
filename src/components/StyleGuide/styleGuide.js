import React from 'react';

import Logo from '@app/components/overrides/Logo';

import ButtonsSection from './buttonsSection';
import ColorsSection from './colorsSection';
import ElementsSection from './elementsSection';
import IconsSection from './iconsSection';
import InputSection from './inputSection';
import classes from './styleGuide.module.css';
import TypographySection from './typographySection';

const StyleGuide = () => {
    const columnsList = [
        [
            {
                title: 'Colors',
                component: <ColorsSection />
            },
            {
                title: 'Buttons',
                component: <ButtonsSection />
            },
            {
                title: 'Icons',
                component: <IconsSection />
            }
        ],
        [
            {
                title: 'Typography',
                component: <TypographySection />
            },
            {
                title: 'Input',
                component: <InputSection />
            },
            {
                title: 'Elements',
                component: <ElementsSection />
            }
        ]
    ];

    return (
        <div className={classes.root}>
            <div className={classes.logoWrapper}>
                <Logo />
            </div>
            <div className={classes.columns}>
                {columnsList.map((column, index) => (
                    <div className={classes.column} key={index}>
                        {column.map((section, index) => (
                            <section className={classes.section} key={index}>
                                <div className={classes.title}>
                                    <h4>{section.title}</h4>
                                </div>
                                {section.component}
                            </section>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StyleGuide;
