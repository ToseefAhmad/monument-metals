import actions from './actions';

export const toggleDrawer = name => async dispatch => dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch => dispatch(actions.toggleDrawer(null));

export const setAccountMenuOpen = isOpen => async dispatch => dispatch(actions.setAccountMenuOpen(isOpen));

export const setAccountMenuView = view => async dispatch => dispatch(actions.setAccountMenuView(view));

/** @deprecated */
export const toggleSearch = () => async dispatch => dispatch(actions.toggleSearch());
