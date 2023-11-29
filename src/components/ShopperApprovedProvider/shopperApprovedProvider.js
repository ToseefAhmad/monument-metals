import { object, string } from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useShopperApprovedProvider } from './useShopperApprovedProvider';

const ShopperApprovedProvider = props => {
    const { data, orderNumber } = props;
    const {
        isShopperProvedPopupEnabled,
        shopperApprovedAccountId,
        shopperApprovedAcountToken,
        shopperApprovedSrc
    } = useShopperApprovedProvider();
    const { firstname, lastname, email } = data;

    if (isShopperProvedPopupEnabled && shopperApprovedAccountId && orderNumber) {
        globalThis.sa_values = {
            site: shopperApprovedAccountId,
            token: shopperApprovedAcountToken,
            orderid: orderNumber,
            name: `${firstname} ${lastname}`,
            email: email
        };
    }

    return (
        <>
            {isShopperProvedPopupEnabled && shopperApprovedSrc && orderNumber ? (
                <Helmet>
                    <script type="text/javascript" src={shopperApprovedSrc} />
                </Helmet>
            ) : null}
        </>
    );
};

export default ShopperApprovedProvider;

ShopperApprovedProvider.propTypes = {
    data: object,
    orderNumber: string
};
