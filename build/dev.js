/*
 * @Author:
 * @Date: 2019-11-19 15:55:35
 * @LastEditors: VSCode
 * @LastEditTime: 2020-03-16 09:26:34
 * @Description: 开发环境启动脚本
 */
const path = require('path');
const portfinder = require('portfinder');
const webpack = require('webpack');
const chalk = require('chalk');
const chokidar = require('chokidar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

const createDLLPromise = require('./dll');
const utils = require('./utils');
const config = require('../config/index');

const host = process.env.HOST || config.dev.host;
const port = process.env.PORT && Number(process.env.PORT) || config.dev.port;

const devServerConfig = {
	clientLogLevel: 'warning',
	historyApiFallback: true,
	inline: true,
	progress: false, // 打包过程
	hot: true,
	contentBase: false,
	compress: true,
	host,
	port,
	open: config.dev.autoOpenBrowser,
	overlay: config.dev.errorOverlay && { warnings: true, errors: true },
	publicPath: '/',
	proxy: config.dev.proxyTable,
	quiet: true, // necessary for FriendlyErrorsPlugin
	watchOptions: {
		poll: config.dev.poll
	}
};
/**
 * @name: createDevPromise
 * @description: 开发环境执行方法
 * @param {Array} dllList: dll列表
 * @return {Promise}
 */
const createDevPromise = function(dllList) {
	return new Promise((resolve, reject) => {
		portfinder.basePort = devServerConfig.port;
		portfinder.getPortPromise().then(function(port, err) {
			if (err) console.log(chalk.red(err));
			else {
				const devWebpackConfig = require('../config/webpack.dev.config');
				// 使用一个新的端口
				process.env.PORT = port;
				devServerConfig.port = port;

				// 添加dll插件
				if (dllList && dllList.length) utils.createDllPlugins(devWebpackConfig, dllList);

				devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
					compilationSuccessInfo: {
						messages: [chalk.green(`Your application is running here: http://${devServerConfig.host}:${port}`)]
					},
					clearConsole: false
				}));

				// 生成webpack编译对象
				console.log(chalk.green('\nStarting development server...'));
				const compiler = webpack(devWebpackConfig);
				const server = new WebpackDevServer(compiler, devServerConfig);

				server.listen(devServerConfig.port, devServerConfig.host, function(err) {
					if (err) console.log(chalk.red(err));
					else resolve();
				});
			}
		});
	});
};

/**
 * @name: developmentStart
 * @description: 开发环境执行方法
 */
const developmentStart = () => {
	createDLLPromise().then(function({ dllList }) {
		createDevPromise(dllList);
	});
};

developmentStart();
