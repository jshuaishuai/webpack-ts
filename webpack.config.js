const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 在每次成功重建后先删除 output.path 目录中的所有文件
const path = require("path");
module.exports = {
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    cache: {
        type: "filesystem",
    },
    devtool: "source-map",
    devServer: {
        hot: true,
        historyApiFallback: true,
        stats: "errors-only",
        proxy: {
            "/eit": {
                target: "http://127.0.0.1:7001",
            },
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            "@": path.resolve("src"), // 这样配置后 @ 可以指向 src 目录
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.tsx$/,
                loader: "source-map-loader",
            },
            {
                //引入antdesign中用的css
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: { importLoaders: 0 },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    stats: "normal", // 只在发生错误或有新的编译时输出
};
