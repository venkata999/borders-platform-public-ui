import client from "../../common/rest/client";
import * as types from "./actionTypes";
import * as actions from "./actions";
import {combineEpics} from "redux-observable";
import {errorObservable} from "../../core/error/epicUtil";

const fetchProcessDefinitions = (action$, store) =>
    action$.ofType(types.FETCH_PROCESS_DEFINITIONS)
        .mergeMap(action => {
            return client({
                method: 'GET',
                path: `/api/workflow/process-definition?latestVersion=true`,
                headers: {
                    "Accept": "application/json"
                }
            }).map(payload => actions.fetchProcessDefinitionsSuccess(payload))
                .catch(error => {
                    return errorObservable(actions.fetchProcessDefinitionsFailure(), error);
                    }
                );
        });


const fetchProcessDefinition = (action$, store) =>
    action$.ofType(types.FETCH_PROCESS_DEFINITION)
        .mergeMap(action =>
            client({
                method: 'GET',
                path: `/api/workflow/process-definition/key/${action.processKey}`,
                headers: {
                    "Accept": "application/json"
                }
            }).map(payload => actions.fetchProcessDefinitionSuccess(payload))
                .catch(error => {
                        return errorObservable(actions.fetchProcessDefinitionFailure(), error);
                    }
                ));

export default combineEpics(fetchProcessDefinitions, fetchProcessDefinition);