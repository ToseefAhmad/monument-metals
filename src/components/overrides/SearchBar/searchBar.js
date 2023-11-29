import { Form } from 'informed';
import { bool, func, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import AmAutocomplete from '@app/components/AdvancedSearch/components/Autocomplete';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './searchBar.module.css';
import SearchField from './searchField';
import { useSearchBar } from './useSearchBar';

// eslint-disable-next-line react/display-name
const SearchBar = React.forwardRef((props, ref) => {
    const { isOpen, isVisible, closeSearchBar } = props;
    const talonProps = useSearchBar({ closeSearchBar });
    const {
        containerRef,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        valid
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const isOpenByDefault = isVisible ? true : isOpen;
    const rootClassName = isOpenByDefault ? classes.root_open : classes.root;
    const [formAction, setFormAction] = useState({});

    const closeSearchBarAndResetForm = () => {
        closeSearchBar();
        formAction.resetForm();
    };

    return (
        <div className={rootClassName} ref={ref}>
            <div ref={containerRef} className={classes.container}>
                <Form autoComplete="off" className={classes.form} initialValues={initialValues} onSubmit={handleSubmit}>
                    <div className={classes.search}>
                        <SearchField
                            closeSearchBar={closeSearchBar}
                            isSearchOpen={isOpen}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            setFormAction={setFormAction}
                        />
                    </div>
                    <div className={classes.autocomplete}>
                        <AmAutocomplete
                            closeSearchBar={closeSearchBar}
                            setVisible={setIsAutoCompleteOpen}
                            valid={valid}
                            visible={isAutoCompleteOpen}
                        />
                    </div>
                    <div className={classes.closeSearchBarSection}>
                        <button
                            type="button"
                            onClick={closeSearchBarAndResetForm}
                            className={classes.closeSearchBarMobile}
                        >
                            <FormattedMessage id="searchBar.closeButtonText" defaultMessage="Cancel" />
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
});

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool,
    isVisible: bool,
    closeSearchBar: func
};
