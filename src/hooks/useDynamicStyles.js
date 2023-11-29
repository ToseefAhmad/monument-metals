import { useState, useEffect } from 'react';

export const CMS_PAGE_TYPE = 'CMS_PAGE';
export const CMS_BLOCK_TYPE = 'CMS_BLOCK';

export const useDynamicStyles = ({ identifier, styles, type }) => {
    const [isStylesLoading, setIsStylesLoading] = useState(true);

    useEffect(() => {
        const getDynamicStyles = async () => {
            const stylePath = styles[identifier];

            if (stylePath && type) {
                try {
                    if (type === CMS_PAGE_TYPE) {
                        await import(`@app/theme-monument/styles/pages/${stylePath}`);
                    } else if (type === CMS_BLOCK_TYPE) {
                        await import(`@app/theme-monument/styles/blocks/${stylePath}`);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            setIsStylesLoading(false);
        };

        getDynamicStyles();

        return () => setIsStylesLoading(true);
    }, [identifier, styles, type]);

    return {
        isStylesLoading
    };
};
