import classnames from 'classnames';
import React from 'react';

import classes from './colorsSection.module.css';

const ColorsSection = () => {
    const colorsList = [
        {
            class: classes.redLight,
            text: '#B22234'
        },
        {
            class: classes.blue,
            text: '#002147'
        },
        {
            class: classes.blackLightest,
            text: '#111927'
        },
        {
            class: classes.grayDark,
            text: '#66686C'
        },
        {
            class: classes.whiteDark,
            text: '#F0F2F5',
            textColorBlack: true
        },
        {
            class: classes.grayLight,
            text: '#E6E9EB',
            textColorBlack: true
        },
        {
            class: classes.blackLighten,
            text: '#06080D'
        },
        {
            class: classes.green,
            text: '#09AF1B'
        },
        {
            class: classes.gold,
            text: '#CFA201'
        },
        {
            class: classes.blueDark,
            text: '#00152E'
        },
        {
            class: classes.blueLighter,
            text: '#002F66'
        },
        {
            class: classes.blackLight,
            text: '#000914'
        },
        {
            class: classes.blueLight,
            text: '#1C2940'
        },
        {
            class: classes.red,
            text: '#991D2D'
        },
        {
            class: classes.redDark,
            text: '#7F1825'
        },
        {
            class: classes.gray,
            text: '#CDCFD1',
            textColorBlack: true
        }
    ];

    return (
        <>
            <div className={classes.list}>
                {colorsList.map((color, index) => (
                    <div className={classes.item} key={index}>
                        <div className={classnames(classes.colorBadge, color.class)}>
                            <span
                                className={classnames({
                                    [classes.colorText]: true,
                                    [classes.colorTextWhite]: !color.textColorBlack,
                                    [classes.colorTextBlack]: color.textColorBlack
                                })}
                            >
                                {color.text}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ColorsSection;
