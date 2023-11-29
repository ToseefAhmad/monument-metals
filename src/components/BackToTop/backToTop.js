import { number, object } from 'prop-types';
import React, { useState } from 'react';

import { DropdownUpLarge } from '@app/components/MonumentIcons';
import Button from '@app/components/overrides/Button';
import Icon from '@app/components/overrides/Icon';
import { useOnScroll } from '@app/hooks/useOnScroll';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './backToTop.module.css';

const DEFAULT_TOP_OFFSET = 300;

const BackToTop = ({ topOffset = DEFAULT_TOP_OFFSET, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const [isScrolled, setIsScrolled] = useState(null);

    useOnScroll(globalThis.document, () => {
        setIsScrolled(globalThis.scrollY > topOffset);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        isScrolled && (
            <Button classes={{ root: classes.topButton, root_normalPriority: classes.topButton }} onClick={scrollToTop}>
                <Icon classes={{ root: classes.arrowIcon }} src={DropdownUpLarge} />
            </Button>
        )
    );
};

BackToTop.propTypes = {
    topOffset: number,
    classes: object
};

export default BackToTop;
