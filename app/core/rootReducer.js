import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar';
import processDefinitions from '../pages/submissions/index';
import error from '../core/error/index';
import {routerReducer} from 'react-router-redux'
import {combineEpics} from 'redux-observable';

export const rootEpic = combineEpics(
    processDefinitions.epic,

);


export const rootReducer = combineReducers({
    loadingBar: loadingBarReducer,
    routing: routerReducer,
    [processDefinitions.constants.NAME]: processDefinitions.reducer,
    [error.constants.NAME]: error.reducer,
});