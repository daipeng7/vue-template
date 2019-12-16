/*
 * @Author: daipeng
 * @Date: 2019-11-19 11:26:47
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 19:54:29
 * @Description: production 环境配置
 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./index');
const utils = require('./utils');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfig = merge(baseWebpackConfig, {
	name: 'production',
	mode: 'production',
	devtool: config.build.productionSourceMap ? config.build.devtool : false,

	optimization: {
		removeEmptyChunks: true,
		splitChunks: {
			chunks: 'all', // 指定那些模块会被优化 他可以接收三字符串值:all（所有chunk都会被优化）,async(异步加载的chunk被优化),initial(初始的chunk被优化) 。你还可以传递function 指定那些模块被优化或不被优化
			minSize: 30000, // 产生的chunk的最小字节
			maxSize: 0,
			minChunks: 2, // 被使用多少次的代码才被提取
			maxAsyncRequests: 5, // 按需加载时的最大并行请求数
			automaticNameDelimiter: '~', // 分隔符
			name: true, // 切块的名字 ，true 表示自定生产一个名字
			cacheGroups: {
				vendor: {
					name: 'vendor',
					chunks: 'all',
					minChunks: 2
				},
				manifest: {
					name: 'manifest',
					chunks: 'all',
					minChunks: Infinity
				},
				app: {
					name: 'app',
					chunks: 'async',
					minChunks: 2
				}
			}
		},
		minimizer: [
			new TerserWebpackPlugin({
				cache: true,
				sourceMap: config.build.productionSourceMap,
				parallel: true,
				extractComments: false,
				terserOptions: {
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
						booleans: true, // 0.7kb
						if_return: true, // 0.4kb
						sequences: true, // 0.7kb
						unused: true, // 2.3kb
						conditionals: true,
						dead_code: true,
						evaluate: true
					},
					mangle: {
						safari10: true
					}
				}
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: config.build.cssSourceMap
					? { safe: true, map: { inline: false } }
					: { safe: true }
			})
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('./env/prod.env')
		}),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.default.assetsSubDirectory,
				ignore: ['.*']
			}
		]),
		config.build.bundleAnalyzerReport && new BundleAnalyzerPlugin({
			analyzerMode: 'server',
			analyzerHost: '127.0.0.1',
			analyzerPort: 8889,
			reportFilename: 'report.html',
			defaultSizes: 'parsed',
			openAnalyzer: true,
			generateStatsFile: false,
			statsFilename: 'stats.json',
			statsOptions: null,
			logLevel: 'info'
		})
	].filter(Boolean)
});

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// const smp = new SpeedMeasurePlugin();

// module.exports = smp.wrap(webpackConfig);
module.exports = webpackConfig;
