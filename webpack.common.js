const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './dist');

module.exports = {
    resolve: {
        extensions: ['.json', '.js', '.jsx'],
        modules: [path.resolve(__dirname), 'node_modules', sourcePath],
    },
    output: {
        path: buildDirectory,
        filename: 'bundle.js',
        publicPath: '/',
        crossOriginLoading: 'anonymous',
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'REALM': JSON.stringify(process.env.REALM),
                'AUTH_URL': JSON.stringify(process.env.AUTH_URL),
                'CLIENT_ID': JSON.stringify(process.env.CLIENT_ID)
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Tether: "tether",
            "window.Tether": "tether"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: path.join(__dirname, 'app'),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'}),
            },
            {
                test: /\.bpmn$/,
                loader: 'file-loader?name=diagrams/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?name=img/[name].[ext]',
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]',
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?mimetype=image/svg+xml&name=img/[name].[ext]',
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]

            },

            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: ["node_modules/**/*.scss"]
                    }
                }]
            }

        ]

    }
};
