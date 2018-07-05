import React from 'react';
import StartForm from "../../../../core/start-forms/components/StartForm";
import queryString from 'query-string';
import {withRouter} from "react-router";

class SafeApp extends React.Component {


    render() {
        this.params = queryString.parse(this.props.location.search);

        return <div>
            <StartForm formName="emergencyResponseForm"
                       formDataContext={{
                           taskid: this.params.taskid,
                           incidentcode: this.params.incidentcode,
                           email: this.params.email,
                           phone: this.params.phone,
                           processinstanceid: this.params.processinstanceid,
                           staffid: this.params.staffid
                       }}
                       processKey="emergency-response"
                       processName="Emergency Response"/>
        </div>
    }
}

export default withRouter(SafeApp);