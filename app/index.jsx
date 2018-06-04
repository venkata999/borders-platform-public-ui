import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './core/App';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import configureStore from './core/store/configureStore';
import 'webpack-icons-installer/bootstrap';
import '../public/styles/app.scss'
import '../public/styles/fonts.css'
import 'rxjs';
import ScrollToTop from "./core/components/ScrollToTop";

const store = configureStore();

const renderApp = (App) => {
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <AppContainer>
                    <BrowserRouter>
                        <ScrollToTop>
                            <App/>
                        </ScrollToTop>
                    </BrowserRouter>
                </AppContainer>
            </div>
        </Provider>, document.getElementById('root')
    );
};
renderApp(App);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./core/App', () => {
        const NextApp = require('./core/App').default;
        render(NextApp)
    })
}