/*
 * @Author:
 * @Date: 2019-11-07 11:48:58
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-31 16:49:06
 * @Description: 构建配置
 */

const path = require('path');

module.exports = {
	default: {
		projectTitle: 'vue项目模版',
		isPc: false,
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsDllDirectory: 'static/dll',
		assetsJSDirectory: 'static/js',
		assetsCSSDirectory: 'static/css',
		assetsSubDirectory: 'static',
		// dll
		dllPath: path.resolve(__dirname, '../dll'),
		usePostCSS: true,
		// px2rem: false
		// 默认为false,不将px转化为rem。
		px2rem: {
			designWidth: 750, // 设计稿宽度
			rootValue: 40, // 设计稿根元素字体大小， 也可以设置{ px: 50, rpx: 100 }
			unitPrecision: 5, // 转化为rem的精度
			propWhiteList: [], // 白名单，默认为空所有的选择器的属性单位都转换
			propBlackList: [], // 黑名单，排除哪些选择器的属性单位不被转换
			exclude: false, // 排除文件夹
			selectorBlackList: [], // 选择器黑名单
			ignoreIdentifier: false, // 需要排除的标识符
			replace: true, // 是否替换
			mediaQuery: false, // 允许在media中转换
			minPixelValue: 1 // 最小转换数
		}
	},
	dev: {
		// Paths
		proxyTable: {
			'/api': {
				// target: 'http://47.98.152.225:5010',
				target: 'http://172.16.25.136:5010',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		},
		host: '0.0.0.0',
		port: 8099, // 会覆盖process.env.PORT
		autoOpenBrowser: true,
		errorOverlay: true,
		notifyOnErrors: true,
		showSpeed: true,
		poll: false, // webpack watch模式

		// 使用eslint
		useEslint: true,
		// 如果为true，则eslint错误和警告也将显示在浏览器中。
		showEslintErrorsInOverlay: false,

		/**
		 * Source Maps
		 */
		devtool: 'cheap-module-eval-source-map',

		// If you have problems debugging vue-files in devtools,
		// set this to false - it *may* help
		// https://vue-loader.vuejs.org/en/options.html#cachebusting
		cacheBusting: true,

		cssSourceMap: true
	},

	build: {
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		/**
		 * Source Maps
		 */
		cssSourceMap: true,
		productionSourceMap: false,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: '#source-map',
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	}
};
