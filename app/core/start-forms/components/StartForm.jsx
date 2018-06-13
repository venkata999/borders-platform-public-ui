import React, {PropTypes} from 'react'
import {
    form, loadingForm, submissionToWorkflowSuccessful, submittingToWorkflow
} from "../selectors";
import {bindActionCreators} from "redux";
import * as actions from "../actions";

import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Form} from 'react-formio';

class StartForm extends React.Component {

    componentDidMount() {
        if (this.props.formName) {
            const formDataContext = this.props.formDataContext;
            const formName = this.props.formName;
            if (formDataContext) {
                this.props.fetchFormWithContext(formName, formDataContext);
            } else {
                this.props.fetchForm(formName);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submissionToWorkflowSuccessful) {
            this.props.history.replace("/tasks");
        }
    }

    componentWillUnmount() {
        this.props.resetForm();
    }


    renderForm() {
        const {loadingForm, form, processName, processKey, variableName} = this.props;

        if (loadingForm) {
            return <div>Loading form for {processName} </div>
        } else {
            const options = {
                noAlerts: true
            };
            if (form) {
                const variableInput = form.components.find(c => c.key === 'submitVariableName');
                const variableName = variableInput ? variableInput.defaultValue : variableName;
                const process = processName ? processName : processKey;
                return <Form form={form}
                             ref={(form) => this.form = form}
                             options={options} onSubmit={(submission) => {
                    this.props.submit(form._id,
                        processKey, variableName, submission.data, process);
                    this.form.formio.emit("submitDone");

                }}/>
            } else {
                return <div/>
            }

        }
    }

    render() {
        return <div>
            {this.renderForm()}
        </div>
    }
}

StartForm.propTypes = {
    fetchForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    fetchFormWithContext: PropTypes.func.isRequired,
    loadingForm: PropTypes.bool
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);


export default connect((state) => {
    return {
        form: form(state),
        loadingForm: loadingForm(state),
        submissionToWorkflowSuccessful: submissionToWorkflowSuccessful(state),
        submittingToWorkflow: submittingToWorkflow(state)

    }
}, mapDispatchToProps)(withRouter(StartForm))