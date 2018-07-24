import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import HomePage from '../pages/home/components/HomePage';
import ErrorHandlingComponent from "./error/component/ErrorHandlingComponent";
import SafeApp from "../pages/internal/safeapp/components/SafeApp";
import Egar from "../pages/public/egar/components/Egar";

const Main = () => (
    <main>
        <Switch onUpdate={() => window.scrollTo(0, 0)}>
            <Route name="Home" exact path="/home" render={() => (
                <HomePage/>
            )}/>
            <Route name="Safe App" exact path='/internal/safeapp' render={() => {
                return <ErrorHandlingComponent><SafeApp/></ErrorHandlingComponent>
            }}/>
            <Route name="Egar" exact path='/public/egar' render={() => {
                return <ErrorHandlingComponent><Egar/></ErrorHandlingComponent>
            }}/>
            <Redirect to="/home"/>
        </Switch>


    </main>
);

export default Main