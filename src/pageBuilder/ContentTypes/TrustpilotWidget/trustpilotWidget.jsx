/* eslint-disable react/jsx-no-target-blank */
import { string } from 'prop-types';
import React, { useEffect, useRef } from 'react';

/**
 * Trustpilot widget component component.
 */
const TrustpilotWidget = ({ trustpilotId }) => {
    const ref = useRef();

    useEffect(() => {
        window.Trustpilot && window.Trustpilot.loadFromElement(ref.current);
    }, []);

    const orderSuccessTrustpilot = '56278e9abfbbba0bdcd568bc';
    const widgetHeight = orderSuccessTrustpilot === trustpilotId ? '38px' : '250px';
    const widgetBorderColor = orderSuccessTrustpilot === trustpilotId ? '#09AF1B' : '#ffffff';

    return (
        <div
            ref={ref}
            className="trustpilot-widget"
            id="trustbox"
            data-locale="en-US"
            data-template-id={trustpilotId}
            data-businessunit-id="5774556d0000ff000591c008"
            data-style-height={widgetHeight}
            data-style-width="100%"
            data-theme="light"
            data-stars="4,5"
            data-no-reviews="hide"
            data-scroll-to-list="true"
            data-allow-robots="true"
            data-border-color={widgetBorderColor}
        >
            <a href="https://www.trustpilot.com/review/monumentmetals.com" target="_blank" rel="noopener">
                Trustpilot
            </a>
        </div>
    );
};

TrustpilotWidget.propTypes = {
    trustpilotId: string
};

export default TrustpilotWidget;
