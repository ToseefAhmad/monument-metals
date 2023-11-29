import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = [
    'TOGGLE_DRAWER',
    'SET_ONLINE',
    'SET_OFFLINE',
    'TOGGLE_SEARCH',
    'EXECUTE_SEARCH',
    'MARK_ERROR_HANDLED',
    'SET_PAGE_LOADING',
    'SET_NEXT_ROOT_COMPONENT',
    'SET_ACCOUNT_MENU_OPEN',
    'SET_ACCOUNT_MENU_VIEW'
];

export default createActions(...actionTypes, { prefix });
