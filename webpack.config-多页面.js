// webpack是node编写的 需要符合node commonjs的写法
const path = require("path");
// 生成html
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩CSS 只能用于生产环境打包 production
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩js 只能用于生产环境打包 production
const TerserJSPlugin = require("terser-webpack-plugin");

const webpack = require("webpack");
module.exports = {
    // 模式 development production
    mode: "development",
    // 入口文件
    entry: {
        home: './home.js',
        other: './other.js'
    },
    // 出口配置
    output: {
        // 打包后的文件名
        filename: "bundle.[hash:10].js",
        // 打包后的路径  必须是一个绝对路径
        path: path.resolve(__dirname, "dist"),
    },
    // 开发服务器配置
    devServer: {
        // 端口
        port: "3000",
        // 进度条
        progress: true,
        // 开启gzip压缩
        compress: true,
        // 访问的静态目录 默认是当前目录
        // contentBase: "./dist",
        // 编译完后是否打开浏览器
        open: false,
    },
    // webpack的所有插件配置 数组
    plugins: [
        new HtmlWebpackPlugin({
            // html模板
            template: "./src/index.html",
            // 打包输出的文件名
            filename: "index.html",
            // 压缩配置 (可生产环境配置)
            minify: {
                // html中删除属性的双引号
                removeAttributeQuotes: true,
                // 折叠空行
                collapseWhitespace: true,
            },
            // 哈希戳
            hash: true,
        }),
        // 抽离css文件
        new MiniCssExtractPlugin({
            // 抽离的css文件民
            filename: "main.css",
        }),
    ],
    // 模块的配置
    module: {
        // 规则
        rules: [
            // 可以处理html中直接引入的图片
            // {
            //     test: /\.html$/,
            //     use: 'html-withimg-loader'
            // },
            // css-loader 解析@import语法以及css中的url()
            // style-loader 把css插入head标签中
            // loader特点 希望单一 只干自己的事
            // 多个loader需要用数组[]
            // loader的解析事从右到做，从下到上
            // loader可以写成字符串形式，还可以写成对象方式，支持添加options参数
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: "eslint-loader", //eslint检测
            //         options: {
            //             enfore: "pre", //强制 在普通loader之前执行 post之后
            //         },
            //     },
            //     exclude: /node_modules/,
            // },
            {
                test: /\.(gif|jpg|png)$/,
                use: {
                    // 小于10kb的图片资源,转换为base64,减少请求,否则用file-loader生成真实文件进行请求
                    loader: "url-loader",
                    options: {
                        limit: 10 * 1024,
                    },
                },
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader", //es6->es5
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
            },
            {
                test: /\.css$/,
                // use: ["style-loader", "css-loader"],
                use: [
                    // {
                    //     loader: "style-loader",
                    //     options: {
                    //         // 外文已移除insertAt属性
                    //         insert: "head",
                    //     },
                    // },
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.less$/,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader, //将less文件抽离为单独的css,名称为main.css
                    "css-loader",
                    "postcss-loader", //兼容不同浏览器，添加前缀
                    "less-loader", //把less转换为css
                ],
            },
        ],
    },
    // 不被打包
    externals: {
        $: "jquery",
    },
    // 优化项
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                test: /\.js(\?.*)?$/i,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
};
