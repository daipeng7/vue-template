/*
 * @Author:
 * @Date: 2019-11-19 11:26:47
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 19:54:13
 * @Description: development 环境配置
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');
const config = require('./index');
const utils = require('./utils');

module.exports = merge(baseWebpackConfig, {
	name: 'development',
	mode: 'development',
	// cheap-module-eval-source-map is faster for development
	devtool: config.dev.devtool,

	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('./env/dev.env')
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new CopyWebpackPlugin([
			{
				from: utils.resolve('./static'),
				to: config.default.assetsSubDirectory,
				ignore: ['.*']
			}
		])
	]
});
