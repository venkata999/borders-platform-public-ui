import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import HomePage from '../pages/home/components/HomePage';
import ErrorHandlingComponent from "./error/component/ErrorHandlingComponent";
import SubmissionsPage from "../pages/submissions/components/SubmissionsPage";
import SubmissionStartPage from "../pages/submissions/components/SubmissionStartPage";
import SafeApp from "../pages/internal/safeapp/components/SafeApp";

const Main = () => (
    <main>
        <Switch onUpdate={() => window.scrollTo(0, 0)}>
            <Route name="Home" exact path="/home" render={() => (
                <HomePage/>
            )}/>

            <Route name="Submission Start" exact path='/submission-start' render={() => {
                return <ErrorHandlingComponent><SubmissionStartPage/></ErrorHandlingComponent>
            }}/>

            <Route name="Procedures" exact path='/submissions' render={() => {
                return <ErrorHandlingComponent><SubmissionsPage/></ErrorHandlingComponent>
            }}/>
            <Route name="Safe App" exact path='/internal/safeapp' render={() => {
                return <ErrorHandlingComponent><SafeApp/></ErrorHandlingComponent>
            }}/>

            <Redirect to="/home"/>
        </Switch>
    </main>
);

export default Main