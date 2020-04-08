/*
 * @Author:
 * @Date: 2019-12-11 09:53:41
 * @LastEditors: VSCode
 * @LastEditTime: 2020-04-05 20:31:41
 * @Description: 打包环境启动脚本
 */

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const createDllPromise = require('./dll');
const utils = require('./utils');
const webpackConfig = require('../config/webpack.prod.config');

const startBuild = (dllList) => {
	const spinner = ora('building for production...\n');
	spinner.start();

	rm(path.join(config.default.assetsRoot), err => {
		if (err) throw err;
		// 添加dll插件
		if (dllList && dllList.length) utils.createDllPlugins(webpackConfig, dllList);
		webpack(webpackConfig, (err, stats) => {
			spinner.stop();
			if (err) throw err;
			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n\n');

			if (stats.hasErrors()) {
				console.log(chalk.red('  Build failed with errors.\n'));
				process.exit(1);
			}

			console.log(chalk.cyan('  Build complete.\n'));
		});
	});
};

createDllPromise().then(function({ dllList }) {
	startBuild(dllList);
});
