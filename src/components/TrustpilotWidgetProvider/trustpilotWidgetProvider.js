import React from 'react';
import { Helmet } from 'react-helmet-async';

const TrustpilotWidgetProvider = () => {
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

export default TrustpilotWidgetProvider;
