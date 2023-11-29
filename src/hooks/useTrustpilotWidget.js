import React from 'react';
import { Helmet } from 'react-helmet-async';

export const useTrustpilotWidget = () => {
    React.useEffect(() => {
        const trustbox = document.getElementById('trustbox');
        if (window.Trustpilot) {
            window.Trustpilot.loadFromElement(trustbox);
        }
    });
    return (
        <Helmet>
            <script
                type="text/javascript"
                src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                async
            />
        </Helmet>
    );
};
