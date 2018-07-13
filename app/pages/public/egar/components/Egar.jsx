import React from "react";
import StartForm from "../../../../core/start-forms/components/StartForm";

class Egar extends React.Component {
    render() {
        return <div>
            <StartForm formName="submitAGeneralAviationReport"
                       processKey="general-aviation-report"
                       processName="General Aviation Report"
                       {...this.props}/>
        </div>;
    }
}

export default Egar;