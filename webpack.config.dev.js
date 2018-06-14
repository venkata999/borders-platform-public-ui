const webpack = require('webpack');
const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');

const port = process.env.PORT || 8080;

const btoa = require('btoa');

const workflowUrl = process.env.WORKFLOW_URL;
const formIOUrl = process.env.FORM_URL;
const translationServiceUrl = process.env.TRANSLATION_SERVICE_URL;

console.log("workflowUrl " + workflowUrl);
console.log("formIOUrl " + formIOUrl);
console.log("translationServiceUrl " + translationServiceUrl);

const basicAuthentication = () => {
    const username= process.env.USERNAME;
    const password = process.env.PASSWORD;
    return "Basic " + btoa(username + ":" + password);
};

module.exports = webpackMerge(commonConfig, {
    devtool: 'eval',
    entry: {
        app: [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://localhost:${port}`,
            'webpack/hot/only-dev-server',
            './app/index'
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: 'public/',
        hot: true,
        open: true,
        port: `${port}`,
        historyApiFallback: true,
        publicPath: commonConfig.output.publicPath,
        stats: {colors: true},
        proxy: {
            "/api/workflow": {
                target: workflowUrl,
                pathRewrite: {
                    '^/api/workflow': '/rest/engine/borders'
                },
                changeOrigin: true,
                onProxyReq: function onProxyReq(proxyReq, req, res) {
                    const authHeader = basicAuthentication();
                    proxyReq.setHeader('Authorization',  authHeader);
                    console.log('Workflow Proxy -->  ', req.method, req.path, '-->', `${workflowUrl}${proxyReq.path}`);
                },
            },
            "/api/translation": {
                target: translationServiceUrl,
                changeOrigin: true
            },
            "/api/form": {
                target: formIOUrl,
                secure: false,
                changeOrigin: true
            }

        }
    }
});

