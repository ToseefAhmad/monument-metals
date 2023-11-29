import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';

const INITIAL_FORM_VALUES = { quantity: 1 };

export const useProduct = props => {
    const { product } = props;
    const { price_tiers, price_range } = product;
    const { url_key, url_suffix } = product;
    const url = resourceUrl(`/${url_key}${url_suffix}`);

    const history = useHistory();
    const { push } = history;

    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        product: {
            ...product,
            __typename: 'SimpleProduct'
        }
    });

    const { handleAddToCart } = talonProps;

    const redirectToProduct = useCallback(() => {
        push(url);
    }, [push, url]);

    const price =
        price_tiers.length > 0
            ? price_tiers[price_tiers.length - 1].final_price.value
            : price_range.maximum_price.final_price.value;

    const currency = product.price_range.maximum_price.final_price.currency;

    return {
        handleAddToCart: product.type_id === 'simple' ? () => handleAddToCart(INITIAL_FORM_VALUES) : redirectToProduct,
        price,
        currency
    };
};
