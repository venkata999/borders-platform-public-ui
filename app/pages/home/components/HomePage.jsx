import React from "react";

class HomePage extends React.Component {
    render() {
        return <div>
            <h2 className="heading-medium">Border Force Submissions Portal</h2>
            <p>
               You can use this portal to submit the following:
            </p>
            <ul className="list list-bullet">
                <li>General Aviation Report</li>
                <li>General Maritime Report</li>
            </ul>
        </div>
    }

}

export default HomePage;