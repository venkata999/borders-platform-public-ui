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
            }).map(payload => {
                return {
                    type: types.FETCH_PROCESS_DEFINITION_FORM,
                    definition: payload,
                    processKey: action.processKey
                }
            }).catch(error => {
                    return errorObservable(actions.fetchProcessDefinitionFailure(), error);
                }
            ));

const fetchDefinitionForm = (action$, store) =>
    action$.ofType(types.FETCH_PROCESS_DEFINITION_FORM)
        .mergeMap(action =>
            client({
                method: 'GET',
                path: `/api/workflow/process-definition/key/${action.processKey}/startForm`,
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'application/json'
                }
            }).map(payload => {
                return actions.fetchProcessDefinitionSuccess({
                    definition: action.definition.entity,
                    formKey: payload.entity.key
                })
            }).catch(error => {
                return errorObservable(actions.fetchProcessDefinitionFailure(), error)
            })
        );

export default combineEpics(fetchProcessDefinitions, fetchProcessDefinition, fetchDefinitionForm);