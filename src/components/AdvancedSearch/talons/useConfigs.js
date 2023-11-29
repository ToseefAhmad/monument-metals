import { useStoreConfig } from '@app/hooks/useStoreConfig';

export const useConfigs = () => {
    const { storeConfig, loading, error } = useStoreConfig({
        fields: [
            'store_code',

            'amasty_xsearch_general_popup_width',
            'amasty_xsearch_general_dynamic_search_width',
            'amasty_xsearch_general_min_chars',
            'amasty_xsearch_general_enable_tabs_search_result',
            'amasty_xsearch_general_four_zero_four_redirect',
            'amasty_xsearch_general_show_related_terms',
            'amasty_xsearch_general_show_related_terms_results',

            'amasty_xsearch_product_enabled',
            'amasty_xsearch_product_title',
            'amasty_xsearch_product_position',
            'amasty_xsearch_product_limit',
            'amasty_xsearch_product_name_length',
            'amasty_xsearch_product_desc_length',
            'amasty_xsearch_product_reviews',
            'amasty_xsearch_product_add_to_cart',
            'amasty_xsearch_product_redirect_single_product',

            'amasty_xsearch_popular_searches_enabled',
            'amasty_xsearch_popular_searches_first_click',
            'amasty_xsearch_popular_searches_title',
            'amasty_xsearch_popular_searches_position',
            'amasty_xsearch_popular_searches_limit',

            'amasty_xsearch_recent_searches_enabled',
            'amasty_xsearch_recent_searches_first_click',
            'amasty_xsearch_recent_searches_title',
            'amasty_xsearch_recent_searches_position',
            'amasty_xsearch_recent_searches_limit',

            'amasty_xsearch_blog_enabled',
            'amasty_xsearch_blog_title',
            'amasty_xsearch_blog_position',
            'amasty_xsearch_blog_limit',
            'amasty_xsearch_blog_name_length',
            'amasty_xsearch_blog_desc_length',

            'amasty_xsearch_brand_enabled',
            'amasty_xsearch_brand_title',
            'amasty_xsearch_brand_position',
            'amasty_xsearch_brand_limit',
            'amasty_xsearch_brand_name_length',
            'amasty_xsearch_brand_desc_length',

            'amasty_xsearch_category_enabled',
            'amasty_xsearch_category_title',
            'amasty_xsearch_category_position',
            'amasty_xsearch_category_limit',
            'amasty_xsearch_category_name_length',
            'amasty_xsearch_category_desc_length',
            'amasty_xsearch_category_full_path',

            'amasty_xsearch_page_enabled',
            'amasty_xsearch_page_title',
            'amasty_xsearch_page_position',
            'amasty_xsearch_page_limit',
            'amasty_xsearch_page_name_length',
            'amasty_xsearch_page_desc_length',

            'amasty_xsearch_landing_page_enabled',
            'amasty_xsearch_landing_page_title',
            'amasty_xsearch_landing_page_position',
            'amasty_xsearch_landing_page_limit',
            'amasty_xsearch_landing_page_name_length',
            'amasty_xsearch_landing_page_desc_length',

            'amasty_xsearch_faq_enabled',
            'amasty_xsearch_faq_title',
            'amasty_xsearch_faq_position',
            'amasty_xsearch_faq_limit',
            'amasty_xsearch_faq_name_length',
            'amasty_xsearch_faq_desc_length',

            'amasty_xsearch_layout_enabled',
            'amasty_xsearch_layout_border',
            'amasty_xsearch_layout_hover',
            'amasty_xsearch_layout_highlight',
            'amasty_xsearch_layout_background',
            'amasty_xsearch_layout_text',
            'amasty_xsearch_layout_hover_text'
        ]
    });

    return {
        storeConfig: storeConfig || {},
        loading,
        error
    };
};
