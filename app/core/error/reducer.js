import Immutable, {List} from 'immutable';
import * as actions from './actionTypes';

const {Map} = Immutable;

const initialState = new Map({
    hasError: false,
    errors: new List([])
});

/**
 * @return {boolean}
 */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.HANDLE_ERROR:
            const error = action.payload;
            const errorToReturn = {};
            errorToReturn.status =  error.status.code;
            errorToReturn.url = error.request.method + " -> " + error.request.path;
            if (error.entity.error) {
                errorToReturn.error = error.entity.error;
            }
            if (error.entity.message) {
                errorToReturn.message = error.entity.message;
            } else {
                errorToReturn.message = isJson(error.entity) ? error.entity : "";
            }

            if (!error.message) {
                errorToReturn.message ="Failed to execute action";
            }
            errorToReturn.raw = error;
            const errors = state.get('errors').push(Immutable.fromJS(errorToReturn));
            return state.set('hasError', true)
                .set('errors',errors);
        case actions.RESET_ERROR:
            return state.set('hasError', false)
                .set('errors', new List([]));

        default:
            return state;
    }
}


export default reducer;
