/*
 * @Author:
 * @Date: 2019-11-18 20:46:39
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 17:55:06
 * @Description: 共用文件提取
 */

const path = require('path');
const webpack = require('webpack');
const config = require('./index');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const resolve = function (dir) {
	return path.resolve(config.default.dllPath, dir);
};

module.exports = {
	name: 'dll',
	entry: {
		vue: [
			'vue/dist/vue.esm.js',
			'vue-router',
			'vuex',
			'vue-lazyload'
		],
		utils: ['lodash', 'date-fns', 'axios', 'fastclick', 'perfect-scrollbar']
	},
	output: {
		path: resolve('.'), // 放在项目的static/js目录下面
		filename: '[name]/[name].dll.js', // 打包文件的名字
		library: '[name]_library' // 可选 暴露出的全局变量名
		// vendor.dll.js中暴露出的全局变量名。
		// 主要是给DllPlugin中的name使用，
		// 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['cache-loader', 'babel-loader']
			}
		]
	},
	optimization: {
		removeEmptyChunks: true,
		minimizer: [
			new TerserWebpackPlugin({
				terserOptions: {
					cache: true,
					sourceMap: false,
					parallel: true,
					compress: {
						// turn off flags with small gains to speed up minification
						arrows: false,
						collapse_vars: false, // 0.3kb
						comparisons: false,
						computed_props: false,
						hoist_funs: false,
						hoist_props: false,
						hoist_vars: false,
						inline: false,
						loops: false,
						negate_iife: false,
						properties: false,
						reduce_funcs: false,
						reduce_vars: false,
						switches: false,
						toplevel: false,
						typeofs: false,

						// a few flags with noticable gains/speed ratio
						// numbers based on out of the box vendor bundle
						booleans: true, // 0.7kb
						if_return: true, // 0.4kb
						sequences: true, // 0.7kb
						unused: true, // 2.3kb

						// required features to drop conditional branches
						conditionals: true,
						dead_code: true,
						evaluate: true
					},
					mangle: {
						safari10: true
					}
				}
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.ProgressPlugin(),
		new webpack.DllPlugin({
			path: resolve('[name]/[name].manifest.json'), // 生成上文说到清单文件，放在当前build文件下面，这个看你自己想放哪里了。
			name: '[name]_library'
		})
	],
	stats: {
		assets: true,
		colors: true,
		errors: true,
		errorDetails: true,
		hash: true
	}
};
