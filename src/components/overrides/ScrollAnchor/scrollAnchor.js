import { node } from 'prop-types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import classes from './scrollAnchor.module.css';

const ScrollAnchor = forwardRef(({ children }, ref) => {
    const anchorRef = useRef();

    useImperativeHandle(ref, () => ({
        scrollIntoView() {
            anchorRef.current.scrollIntoView(...arguments);
        }
    }));

    return (
        <>
            <div ref={anchorRef} className={classes.anchor} />
            {children}
        </>
    );
});

ScrollAnchor.displayName = 'ScrollAnchor';

ScrollAnchor.propTypes = {
    children: node
};

export default ScrollAnchor;
