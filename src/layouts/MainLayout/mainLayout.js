import { node } from 'prop-types';
import React from 'react';

import Main from '@app/components/overrides/Main';

import { useMainLayout } from './useMainLayout';

const MainLayout = ({ children }) => {
    const { hasOverlay } = useMainLayout();

    return <Main isMasked={hasOverlay}>{children}</Main>;
};

MainLayout.propTypes = {
    children: node
};

export default MainLayout;
