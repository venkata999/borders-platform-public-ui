import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar';
import submissionsPage from '../pages/submissions/index';
import error from '../core/error/index';
import {routerReducer} from 'react-router-redux'
import {combineEpics} from 'redux-observable';
import form from './start-forms/index';

export const rootEpic = combineEpics(
    submissionsPage.epic,
    form.epic

);


export const rootReducer = combineReducers({
    loadingBar: loadingBarReducer,
    routing: routerReducer,
    [submissionsPage.constants.NAME]: submissionsPage.reducer,
    [error.constants.NAME]: error.reducer,
    [form.constants.NAME]: form.reducer,
});