export const GOLD = 'Gold';
export const SILVER = 'Silver';
export const PLATINUM = 'Platinum';
export const PALLADIUM = 'Palladium';

export const STOCK_ALERTS = 'out_of_stock';
export const PRICE_ALERTS = 'product_price';
export const METAL_ALERTS = 'metal_price';

export const BELOW = 'Falls below';
export const ABOVE = 'Rises above';

export const MetalSelect = [
    { key: '0', value: 0, label: GOLD },
    { key: '1', value: 1, label: SILVER },
    { key: '2', value: 2, label: PLATINUM },
    { key: '3', value: 3, label: PALLADIUM }
];

export const InitMetal = '0';

export const PriceSelect = [{ key: '1', value: 1, label: BELOW }, { key: '2', value: 2, label: ABOVE }];

export const PriceType = type => {
    return {
        1: BELOW,
        2: ABOVE
    }[type];
};

export const MetalType = type => {
    return {
        0: GOLD,
        1: SILVER,
        2: PLATINUM,
        3: PALLADIUM
    }[type];
};
