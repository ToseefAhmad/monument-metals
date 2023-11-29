import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { getStoreConfigQuery } from '@app/hooks/useStoreConfig/useStoreConfig.gql';

const globalStoreConfig = new Map(Object.entries(globalThis.__STORE_CONFIG__ || {}));

export const useStoreConfig = props => {
    const { fields } = props;
    const unresolvedFields = useMemo(() => fields.filter(field => !globalStoreConfig.has(field)), [fields]);
    const getStoreConfig = useMemo(() => getStoreConfigQuery(unresolvedFields), [unresolvedFields]);

    const [fetchStoreConfig, { data, called, loading, error }] = useLazyQuery(getStoreConfig, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const resultConfig = useMemo(() => {
        if (loading || (called && !data?.storeConfig)) {
            return null;
        }

        const resolvedFields = fields.filter(field => globalStoreConfig.has(field));

        if (unresolvedFields.length && !data) {
            return null;
        }

        const result = {};

        resolvedFields.forEach(field => (result[field] = globalStoreConfig.get(field)));

        if (unresolvedFields.length) {
            Object.assign(result, data.storeConfig);
        }

        return result;
    }, [called, fields, loading, data, unresolvedFields]);

    useEffect(() => {
        if (unresolvedFields.length && !called) {
            fetchStoreConfig();
        }
    }, [unresolvedFields, called, fetchStoreConfig]);

    return {
        storeConfig: resultConfig,
        loading,
        error
    };
};
