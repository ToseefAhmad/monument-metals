import { useQuery } from '@apollo/client';
import { String } from 'prop-types';

export const useItems = props => {
    const { inputText, query, queryName, valid } = props;

    const { loading, error, data } = useQuery(query, {
        variables: { inputText },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !inputText || !valid
    });

    return {
        data: data ? data[queryName] || data : {},
        loading,
        error
    };
};

useItems.propTypes = {
    inputText: String,
    query: String,
    queryName: String
};
