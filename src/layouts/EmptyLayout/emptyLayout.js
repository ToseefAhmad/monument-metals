import { node } from 'prop-types';
import React from 'react';

const EmptyLayout = ({ children }) => {
    return <>{children}</>;
};

EmptyLayout.propTypes = {
    children: node
};

export default EmptyLayout;
