const path = require('path');
const Strip = require('strip-loader');


module.exports = function (env = {}) {
    const dev = env.dev;

    return {
        mode: dev ? "development" : "production",
        entry: dev ? ["@babel/polyfill", "./src/index.js"] : './src/waxios.js',
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: dev ? "waxios.js" : "waxios.min.js",
            sourceMapFilename: dev ? "waxios.map" : "waxios.min.map",
            libraryTarget: "umd",
        },
        module: {
            rules: [{
                test: /\.js$/i,
                use: [
                    {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }, ...dev?[]:[{
                    loader: Strip.loader('alert', 'assert'),
                }]
            ]
            }]
        },
        devtool: "source-map",
        devServer: {
            port: 8080,
            open: true,
        }
    }
}