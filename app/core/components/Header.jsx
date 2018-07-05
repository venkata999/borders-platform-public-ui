import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import LoadingBar from 'react-redux-loading-bar'

import img from 'govuk_template_ejs/assets/images/gov.uk_logotype_crown_invert_trans.png?0.23.0'
import ResponsiveMenu from 'react-responsive-navbar';
import * as errorActionTypes from '../../core/error/actionTypes';
import {bindActionCreators} from "redux";
import PubSub from "pubsub-js";

class Header extends React.Component {

    componentWillMount() {
        this.changeRoute = this.changeRoute.bind(this);
        const path = this.props.location.pathname;
        window.addEventListener('resize', this.handleWindowSizeChange);
        this.state = {
            routerPath: path
        }
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({width: window.innerWidth});
    };

    changeRoute(path) {
        this.setState({routerPath: path});
        this.props.resetError();
        PubSub.publish("submission", {
            submission: false,
            message: null
        });
        this.props.history.replace(path);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({routerPath: nextProps.location.pathname});
        }
    }


    render() {
        const {routerPath} = this.state;

        const pointerStyle = {cursor: 'pointer'};

        const isProcess = (routerPath) => {
            return routerPath === '/submissions' || routerPath === '/submission-start';
        };

        const navWidth = window.innerWidth <= 500 ? 'inherit' : '700px';

        return <div>
            <header role="banner" id="global-header" className="with-proposition">
                <div className="header-wrapper">
                    <div className="header-global">
                        <div className="header-logo">
                            <a href="https://www.gov.uk/" title="Go to the GOV.UK homepage" id="logo"
                               className="content">
                                <img src={img} width="36" height="32" alt=""/> UK Border Force
                            </a>
                        </div>
                    </div>

                </div>
            </header>
            <div id="global-header-bar"/>
            <LoadingBar
                updateTime={100}
                maxProgress={100}
                progressIncrease={4}
                scope="header"
                className="loading-bar"
            />
        </div>
    }
}


const mapDispatchToProps = dispatch => bindActionCreators({
    resetError: () => dispatch({type: errorActionTypes.RESET_ERROR})
}, dispatch);


export default withRouter(connect((state) => {
    return {}
}, mapDispatchToProps)(Header))