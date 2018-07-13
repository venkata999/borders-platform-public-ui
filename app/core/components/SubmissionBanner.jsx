import React from "react";
import PubSub from 'pubsub-js';


class SubmissionBanner extends React.Component {

    constructor() {
        super();
        this.state = {submission: false, message: null,  visibility: 'hidden'};
        PubSub.subscribe('submission', (msg, data) => {
            if (data.submission) {
                this.setState({
                    submission: data.submission,
                    message: data.message
                });
            }
        });
    }


    render() {
        const {submission, message} = this.state;

        return submission ? <div className="container">
                <div className="govuk-box-highlight confirm-page new">
                    <span className="hod-checkmark"/>
                    <h2 className="heading-small">
                        {message}
                    </h2>
                </div>
            </div> : <div/>
    }
}

export default SubmissionBanner;