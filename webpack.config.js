// 导入所需的依赖包
const merge = require('webpack-merge'); // 用于合并webpack配置
const argv = require('yargs-parser')(process.argv.slice(2)); // 解析命令行参数
const { resolve } = require('path'); // Node.js 路径处理
const _mode = argv.mode || 'development'; // 获取构建模式，默认为开发模式
const _modeflag = _mode === 'production' ? true : false; // 判断是否为生产模式
const _mergeConfig = require(`./config/webpack.${_mode}.js`); // 根据模式导入对应的配置文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // CSS 提取插件

// webpack 基础配置
const webpackBaseConfig = {
    // 入口配置
    entry: {
        main: resolve('src/index.tsx'), // 项目主入口文件
    },
    // 输出配置
    output: {
        path: resolve(process.cwd(), 'dist'), // 构建输出目录
    },
    // 模块处理规则
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, // 处理 TypeScript 文件
                exclude: /(node_modules)/, // 排除 node_modules 目录
                use: {
                    loader: 'swc-loader', // 使用 swc-loader 进行编译，可通过 .swcrc 配置
                },
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i, // 处理字体和图片资源
                type: 'asset/resource', // 将资源文件输出到输出目录
            },
            {
                test: /\.css$/i, // 处理 CSS 文件
                include: [resolve(__dirname, 'src'), resolve(__dirname, 'node_modules')], // 包含的目录
                use: [
                    MiniCssExtractPlugin.loader, // 提取 CSS 到单独文件
                    { loader: 'css-loader', options: { importLoaders: 1 } }, // 处理 CSS 导入
                    'postcss-loader', // 使用 PostCSS 处理 CSS
                ],
            },
        ],
    },
    // 代码分割配置（待完成）
    optimization: {},
    // 模块解析配置
    resolve: {
        // 路径别名配置，方便模块导入
        alias: {
            '@': resolve('src/'), // 源码根目录
            '@components': resolve('src/components'), // 组件目录
            '@hooks': resolve('src/hooks'), // Hooks 目录
            '@pages': resolve('src/pages'), // 页面目录
            '@layouts': resolve('src/layouts'), // 布局目录
            '@assets': resolve('src/assets'), // 资源目录
            '@states': resolve('src/states'), // 状态管理目录
            '@service': resolve('src/service'), // 服务目录
            '@utils': resolve('src/utils'), // 工具函数目录
            '@lib': resolve('src/lib'), // 库文件目录
            '@constants': resolve('src/constants'), // 常量目录
            '@connectors': resolve('src/connectors'), // 连接器目录
            '@abis': resolve('src/abis'), // ABI 目录
            '@types': resolve('src/types'), // 类型定义目录
        },
        // 可以省略的文件扩展名
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
        // 浏览器环境降级配置
        fallback: {
            // stream: require.resolve('stream-browserify'),  // 如需 stream 功能可取消注释
        },
    },
    // webpack 插件配置
    plugins: [
        new MiniCssExtractPlugin({
            // 配置 CSS 文件输出名称，生产环境带 hash
            filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
            chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
            ignoreOrder: false, // 保留 CSS 顺序警告
        }),
    ],
};

// 合并基础配置和环境特定配置
module.exports = merge.default(webpackBaseConfig, _mergeConfig);
