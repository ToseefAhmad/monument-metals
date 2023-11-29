import { bool, func } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { Search as SearchIcon, Close as CloseIcon } from '@app/components/MonumentIcons';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import classes from './searchField.module.css';

const searchIcon = <Icon src={SearchIcon} />;
const clearIcon = <Icon src={CloseIcon} />;

const SearchField = props => {
    const { isSearchOpen, onChange, onFocus, closeSearchBar, setFormAction } = props;
    const { inputRef, resetForm, value } = useSearchField({ isSearchOpen });
    const { formatMessage } = useIntl();

    const closeSearchBarAndResetForm = () => {
        resetForm();
        closeSearchBar();
    };

    useEffect(() => {
        // Lift up resetForm function.
        setFormAction({ resetForm });
    }, [resetForm, setFormAction]);

    const resetButton = value ? <Trigger action={closeSearchBarAndResetForm}>{clearIcon}</Trigger> : null;
    const icon = resetButton ? resetButton : searchIcon;

    const searchPlaceholderText = formatMessage({
        id: 'searchField.searchPlaceholder',
        defaultMessage: 'Search Here...'
    });

    return (
        <TextInput
            after={icon}
            field="search_query"
            onFocus={onFocus}
            onValueChange={onChange}
            forwardedRef={inputRef}
            classes={{ input: classes.search }}
            placeholder={searchPlaceholderText}
        />
    );
};

export default SearchField;

SearchField.propTypes = {
    isSearchOpen: bool,
    onChange: func,
    onFocus: func,
    closeSearchBar: func,
    setFormAction: func
};
