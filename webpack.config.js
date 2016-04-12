var webpack = require('webpack');

module.exports = {
    //entry: [
    //    'webpack-dev-server/client?http://localhost:8080',
    //    'webpack/hot/only-dev-server',
    //    './src/index.jsx'
    //],
    entry: {
        popup: './src/popup/index.jsx',
        contentscript: './src/contentscript/index.js',
        background: './src/background/index.js',

    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist/scripts',
        filename: '[name].js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
};