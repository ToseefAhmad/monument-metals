import { handleActions } from 'redux-actions';

import actions from '../actions/app';

export const name = 'app';

// As far as the server is concerned, the app is always online
const isServer = !globalThis.navigator;
const isOnline = !isServer && navigator.onLine;
const hasBeenOffline = !isServer && !navigator.onLine;

const initialState = {
    drawer: null,
    hasBeenOffline,
    isOnline,
    isPageLoading: false,
    overlay: false,
    pending: {},
    searchOpen: false,
    nextRootComponent: null,
    isAccountMenuOpen: false,
    accountMenuView: 'SIGNIN'
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        if (payload === 'nav') {
            return {
                ...state,
                drawer: payload,
                overlay: false
            };
        }

        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.toggleSearch]: state => {
        return {
            ...state,
            searchOpen: !state.searchOpen
        };
    },
    [actions.setOnline]: state => {
        return {
            ...state,
            isOnline: true
        };
    },
    [actions.setOffline]: state => {
        return {
            ...state,
            isOnline: false,
            hasBeenOffline: true
        };
    },
    [actions.setPageLoading]: (state, { payload }) => {
        return {
            ...state,
            isPageLoading: !!payload
        };
    },
    [actions.setNextRootComponent]: (state, { payload }) => {
        return {
            ...state,
            nextRootComponent: payload
        };
    },
    [actions.setAccountMenuOpen]: (state, { payload }) => {
        return {
            ...state,
            isAccountMenuOpen: payload
        };
    },
    [actions.setAccountMenuView]: (state, { payload }) => {
        return {
            ...state,
            accountMenuView: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
