import { shape, string, bool, object, func } from 'prop-types';
import React from 'react';

import { AVAILABLE_ITEMS_CODES } from '../../constants';

import Item from './item';
import classes from './resultsBlock.module.css';

const Items = props => {
    const { valid, item, storeConfig, setInputSearchValue, closeSearchBar } = props;
    const { code } = item;

    if (!storeConfig) {
        return null;
    }

    if (
        (!valid && (!AVAILABLE_ITEMS_CODES.includes(code) || !storeConfig[`amasty_xsearch_${code}_first_click`])) ||
        !Array.isArray(item.items) ||
        !item.items.length ||
        !storeConfig[`amasty_xsearch_${code}_enabled`]
    ) {
        return null;
    }

    const titleLength = storeConfig[`amasty_xsearch_${code}_name_length`];
    const titleName = storeConfig[`amasty_xsearch_${code}_title`];
    const title = titleLength ? titleName.slice(0, titleLength) : titleName;

    const limit = storeConfig[`amasty_xsearch_${code}_limit`];
    const position = storeConfig[`amasty_xsearch_${code}_position`];

    const list = item.items
        .slice(0, limit)
        .map((listItem, index) => (
            <Item
                closeSearchBar={closeSearchBar}
                key={listItem.name + index}
                item={listItem}
                code={code}
                setInputSearchValue={setInputSearchValue}
            />
        ));

    return (
        <div className={`${classes.block} ${classes[code]}`} style={{ order: position }}>
            <h4 className={classes.head}>{title}</h4>
            <ul className={classes.list}>{list}</ul>
        </div>
    );
};

export default Items;

Items.propTypes = {
    valid: bool,
    submitForm: func,
    item: shape({
        configName: string,
        queryName: string,
        query: object
    }),
    storeConfig: object,
    setInputSearchValue: func,
    closeSearchBar: func.isRequired
};
