import { useFieldState } from 'informed';
import { debounce } from 'lodash';
import { bool, func } from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useAmXsearchContext } from '../../context';
import GET_SEARCH from '../../queries/getSearch.graphql';
import { useItems } from '../../talons/useItems';
import { useSearchBar } from '../../talons/useSearchBar';

import Items from './items';
import classes from './resultsBlock.module.css';

const ResultsBlock = props => {
    const { valid, closeSearchBar } = props;
    const [inputText, setInputText] = useState('');
    const { value } = useFieldState('search_query');
    const { setInputSearchValue } = useSearchBar();
    const { storeConfig } = useAmXsearchContext();

    const updateInputText = useCallback(setInputText, [setInputText]);
    const debounced = useMemo(() => debounce(updateInputText, 150), [updateInputText]);

    const { data } = useItems({
        inputText,
        valid,
        query: GET_SEARCH
    });

    useEffect(() => {
        debounced(value + '');

        return () => {
            debounced.cancel();
        };
    }, [debounced, value]);

    const list = Object.keys(data).map((item, index) => (
        <Items
            closeSearchBar={closeSearchBar}
            setInputSearchValue={setInputSearchValue}
            storeConfig={storeConfig}
            item={data[item]}
            valid={valid}
            key={data[item] + index}
        />
    ));

    return <div className={classes.resultsBlockWrapper}>{list}</div>;
};

export default ResultsBlock;

ResultsBlock.propTypes = {
    valid: bool,
    closeSearchBar: func.isRequired
};
