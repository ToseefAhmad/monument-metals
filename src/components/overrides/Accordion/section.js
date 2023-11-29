import { string, node, shape } from 'prop-types';
import React, { useCallback } from 'react';

import { DropdownDownLarge as ArrowDown, DropdownUpLarge as ArrowUp } from '@app/components/MonumentIcons';
import Icon from '@app/components/overrides/Icon';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useAccordionContext } from './accordion';
import defaultClasses from './section.module.css';

const Section = ({ children, id, title, classes: propClasses }) => {
    const { handleSectionToggle, openSectionIds } = useAccordionContext();
    const classes = useStyle(defaultClasses, propClasses);

    const handleSectionToggleWithId = useCallback(() => handleSectionToggle(id), [handleSectionToggle, id]);

    const isOpen = openSectionIds.has(id);
    const titleIconSrc = isOpen ? ArrowUp : ArrowDown;
    const titleIcon = <Icon src={titleIconSrc} />;

    const contentsContainerClass = isOpen ? classes.contents_container : classes.contents_container_closed;

    return (
        <div className={classes.root}>
            <button className={classes.title_container} onClick={handleSectionToggleWithId} type="button">
                <span className={classes.title_wrapper}>
                    <span className={classes.title}>{title}</span>
                    {titleIcon}
                </span>
            </button>
            <div className={contentsContainerClass}>{children}</div>
        </div>
    );
};

Section.propTypes = {
    classes: shape({
        root: string,
        title_container: string,
        title_wrapper: string,
        title: string,
        contents_container: string,
        contents_container_closed: string
    }),
    id: string,
    title: string,
    children: node
};

export default Section;
