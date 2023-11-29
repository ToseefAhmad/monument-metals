import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { bool } from 'prop-types';
import React from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';

import classes from './priceBar.module.css';
import PriceBarShimmer from './priceBarShimmer';
import PriceEntry from './priceEntry';
import PriceSlider from './priceSlider';

const GOLD_CODE = 'gold';
const SILVER_CODE = 'silver';
const PLATINUM_CODE = 'platinum';
const PALLADIUM_CODE = 'palladium';

const PriceBar = ({ hasNotification }) => {
    const fetch = [GOLD_CODE, SILVER_CODE, PLATINUM_CODE, PALLADIUM_CODE];
    const { isDesktopScreen } = useScreenSize();

    const { error, loading, data } = useQuery(GET_PRICE_UPDATE, {
        variables: { identifiers: fetch },
        fetchPolicy: 'no-cache',
        pollInterval: 30000
    });

    if (loading) {
        return <PriceBarShimmer hasNotification={hasNotification} />;
    }

    if (!data || !data.metalPrices || error) {
        return null;
    }

    const { items } = data.metalPrices;

    if (!Array.isArray(items) || !items.length) {
        return null;
    }

    if (isDesktopScreen) {
        const metals = items.map(item => <PriceEntry key={item.identifier} {...item} />);

        return (
            <div
                className={classnames({
                    [classes.priceContainer]: true,
                    [classes.notification]: hasNotification
                })}
            >
                {metals}
            </div>
        );
    } else {
        return <PriceSlider entries={items} hasNotification={hasNotification} />;
    }
};

export const GET_PRICE_UPDATE = gql`
    query metalPrices($identifiers: [String]!) {
        metalPrices(identifiers: $identifiers) {
            items {
                identifier
                ask
                change
            }
        }
    }
`;

PriceBar.propTypes = {
    hasNotification: bool
};

export default PriceBar;
