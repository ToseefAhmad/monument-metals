import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        categories {
            id
            uid
            is_active
            name
            url_key
            breadcrumbs {
                category_id
                category_name
            }
        }
        description {
            html
        }
        short_description {
            html
        }
        id
        uid
        media_gallery_entries {
            # id is deprecated and unused in our code, but lint rules require we
            # request it if available
            id
            uid
            label
            position
            disabled
            file
        }
        meta_title
        meta_description
        meta_keyword
        name
        preorder_note
        metal_type
        price_range {
            maximum_price {
                final_price {
                    currency
                    value
                }
                fee_price {
                    currency
                    value
                }
            }
        }
        price_tiers {
            final_price {
                currency
                value
            }
            fee_price {
                currency
                value
            }
            quantity
        }
        sku
        small_image {
            url
        }
        stock_status
        url_key
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                    uid
                    default_label
                    label
                    store_label
                    use_default_value
                    value_index
                    swatch_data {
                        ... on ImageSwatchData {
                            thumbnail
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                product {
                    id
                    uid
                    media_gallery_entries {
                        # id is deprecated and unused in our code, but lint rules require we
                        # request it if available
                        id
                        uid
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                    preorder_note
                    price_range {
                        maximum_price {
                            final_price {
                                currency
                                value
                            }
                            fee_price {
                                currency
                                value
                            }
                        }
                    }
                    price_tiers {
                        final_price {
                            currency
                            value
                        }
                        fee_price {
                            currency
                            value
                        }
                        quantity
                    }
                }
            }
        }
    }
`;
