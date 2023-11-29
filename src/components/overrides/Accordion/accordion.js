import { shape, string, bool, node } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useAccordion } from '@magento/peregrine/lib/talons/Accordion/useAccordion';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accordion.module.css';

const AccordionContext = createContext();
const { Provider } = AccordionContext;

const Accordion = ({ canOpenMultiple = true, children, classes: propClasses }) => {
    // The talon is the source of truth for the context value.
    const talonProps = useAccordion({ canOpenMultiple, children });
    const { handleSectionToggle, openSectionIds } = talonProps;
    const contextValue = {
        handleSectionToggle,
        openSectionIds
    };

    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Provider value={contextValue}>
            <div className={classes.root}>{children}</div>
        </Provider>
    );
};

Accordion.defaultProps = {
    canOpenMultiple: true
};

Accordion.propTypes = {
    classes: shape({
        root: string
    }),
    canOpenMultiple: bool,
    children: node
};

export default Accordion;

export const useAccordionContext = () => useContext(AccordionContext);
