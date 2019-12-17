/*
 * @Author:
 * @Date: 2019-11-19 16:01:40
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 15:55:05
 * @Description:
 */

const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');
const packageConfig = require('../package.json');
const config = require('../config');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

/**
 * @description: 获取项目绝对地址
 * @param {string} dir
 * @return: 绝对地址
 */
exports.resolve = function resolve(dir) {
	return path.join(__dirname, '..', dir);
};

/**
 * @description: 浏览器消息框
 * @return: 回调方法
 */
exports.createNotifierCallback = () => {
	return (severity, errors) => {
		if (severity !== 'error') return;

		const error = errors[0];
		const filename = error.file && error.file.split('!').pop();

		notifier.notify({
			title: packageConfig.name,
			message: severity + ': ' + error.name,
			subtitle: filename || '',
			icon: exports.resolve('./static/images/logo.png')
		});
	};
};
/**
 * @description: 添加dll插件
 */
exports.createDllPlugins = (webpackConfig, dllList = []) => {
	webpackConfig.plugins = webpackConfig.plugins || [];
	dllList.forEach(dll => {
		webpackConfig.plugins.push(
			new webpack.DllReferencePlugin({
				context: path.resolve(__dirname, '..'),
				manifest: require(dll.manifestPath)
			})
		);
		// 这个主要是将生成的vendor.dll.js文件加上hash值插入到页面中。
		webpackConfig.plugins.push(
			new AddAssetHtmlPlugin([{
				publicPath: '/' + config.default.assetsDllDirectory,
				outputPath: '/' + config.default.assetsDllDirectory,
				filepath: dll.dllPath,
				hash: true
			}])
		);
	});
};
