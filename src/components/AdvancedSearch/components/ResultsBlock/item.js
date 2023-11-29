import { shape, string, func } from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { AVAILABLE_ITEMS_CODES, URLS } from '../../constants';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import classes from './resultsBlock.module.css';

const toHTML = str => ({ __html: str });

const Item = props => {
    const { item, code, setInputSearchValue, closeSearchBar } = props;

    const isAvailableCodes = AVAILABLE_ITEMS_CODES.includes(code);
    const name = isAvailableCodes ? item.name.replace(/(<([^>]+)>)/gi, '') : item.name;
    const url = isAvailableCodes ? `${URLS.SEARCHURLPARAMS}${name}` : `/${item.url}`;

    const title = (
        <Fragment>
            <span dangerouslySetInnerHTML={toHTML(name)} />
            {code !== 'recent_searches' && item.num_results && (
                <span className={classes.counter}>{item.num_results}</span>
            )}
        </Fragment>
    );

    const action = AVAILABLE_ITEMS_CODES.includes(code) ? (
        <Trigger classes={{ root: classes.link }} action={() => setInputSearchValue(name)}>
            {title}
        </Trigger>
    ) : (
        <Link onClick={closeSearchBar} className={classes.link} to={resourceUrl(url)}>
            {title}
        </Link>
    );

    return <li className={classes.item}>{action}</li>;
};

export default Item;

Item.propTypes = {
    item: shape({
        code: string,
        name: string,
        num_results: string,
        url: string
    }),
    code: string,
    setInputSearchValue: func,
    closeSearchBar: func.isRequired
};
