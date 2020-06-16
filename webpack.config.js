const path = require('path');


module.exports = function (env = {}) {
    const dev = env.dev;

    return {
        mode: dev ? "development" : "production",
        entry: ["@babel/polyfill", "./src/index.js"],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: dev ? "Mwaxios.js" : "Mwaxios.min.js",
            sourceMapFilename: dev ? "Mwaxios.map" : "Mwaxios.min.map",
            libraryTarget: "umd",
        },
        module: {
            rules: [{
                test: /\.js$/i,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        },
        devtool: "source-map",
        devServer: {
            port: 8080,
            open: true,
        }
    }
}