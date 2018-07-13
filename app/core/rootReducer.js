import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar';
import error from '../core/error/index';
import {routerReducer} from 'react-router-redux'
import {combineEpics} from 'redux-observable';
import form from './start-forms/index';

export const rootEpic = combineEpics(
    form.epic

);


export const rootReducer = combineReducers({
    loadingBar: loadingBarReducer,
    routing: routerReducer,
    [error.constants.NAME]: error.reducer,
    [form.constants.NAME]: form.reducer,
});