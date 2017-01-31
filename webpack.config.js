var path = require("path");

module.exports = {
    entry: {
        app: "./src/content/ts/index.ts"
    },
    output: {
        filename: "./dist/bundle.js"
    },
    resolve: {
        extensions: ["", ".ts", ".js"],
        fallback: path.join(__dirname, "node_modules")
    },
    module: {
        loaders: [{
            test: /.ts$/,
            loaders: ["awesome-typescript-loader"]
        }, {
            test: /\.html$/,
            loader: "raw-loader"
        }]
    }
};
