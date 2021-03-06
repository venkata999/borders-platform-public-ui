import Immutable from 'immutable';
import * as actions from './actionTypes';

const {Map} = Immutable;

const initialState = new Map({
    loadingForm: false,
    form: null,
    successfulFormValidation: null,
    submittingToWorkflow: false,
    submissionToWorkflowSuccessful: null,
});

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.RESET_FORM:
            return initialState;
        case actions.FETCH_FORM:
            return state.set('loadingForm', true)
                .set('form', null)
                .set('submittingToWorkflow', false)
                .set('submissionToWorkflowSuccessful', false);
        case actions.FETCH_FORM_SUCCESS:
            const data = action.payload.entity;
            return state.set('loadingForm', false)
                .set('form', data);
        case actions.FETCH_FORM_FAILURE:
            return state.set('loadingForm', false);
        case actions.SUBMIT_FAILURE:
            return state.set('successfulFormValidation', false);
        case actions.SUBMIT_TO_WORKFLOW:
            console.log('IFrame: Submitting to workflow');
            return state.set('submittingToWorkflow', true);
        case actions.SUBMIT_TO_WORKFLOW_SUCCESS:
            console.log('IFrame: Submission to workflow successful');
            return state.set('submittingToWorkflow', false)
                .set('submissionToWorkflowSuccessful', true)
                .set('successfulFormValidation', true);
        case actions.SUBMIT_TO_WORKFLOW_FAILURE:
            return state.set('submittingToWorkflow', false)
                .set('submissionToWorkflowSuccessful', false)
                .set('successfulFormValidation', false);

        default:
            return state;
    }
}

export default reducer;
