/*
 * @Author:
 * @Date: 2019-11-19 11:22:56
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 19:55:48
 * @Description:
 */

const path = require('path');
const fs = require('fs');
const config = require('./index');
const packageConfig = require('../package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const { px2rem } = config.default;
/**
 * @description: 获取项目绝对地址
 * @param {string} dir
 * @return: 绝对地址
 */
exports.resolve = function resolve(dir) {
	return path.join(__dirname, '..', dir);
};

/**
 * @description: 计算打包资源相对地址
 * @param {string} _path 当前文件地址
 * @return: path
 */
exports.assetsPath = function (_path) {
	return path.posix.join(config.default.assetsSubDirectory, _path);
};

/**
 * @description: 获取css loaders表
 * @param {object} options
 * @return: loader表
 */
exports.cssLoaders = function (options) {
	options = options || {};

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: options.sourceMap
		}
	};

	const postcssLoader = {
		loader: 'postcss-loader',
		options: {
			ident: 'postcss',
			plugins: [
				require('postcss-import')(),
				require('postcss-url')(),
				require('autoprefixer')()
			],
			sourceMap: options.sourceMap
		}
	};

	if (px2rem) {
		postcssLoader.options.plugins.push(require('postcss-plugin-px2rem')(px2rem));
	}
	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions) {
		const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			});
		}
		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			loaders.unshift({
				loader: MiniCssExtractPlugin.loader,
				options: {
					hmr: !isProduction
				}
			});
		}
		loaders.unshift('vue-style-loader');
		return loaders;
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true, implementation: require('sass'), prependData: options.prependData }),
		scss: generateLoaders('sass', { implementation: require('sass'), prependData: options.prependData }),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	};
};

/**
 * @description: webpack样式rule数据
 * @param {object} options
 * @return: 输出webpack样式rule数据
 */
exports.styleLoaders = function (options) {
	const output = [];
	const loaders = exports.cssLoaders(options);

	for (const extension in loaders) {
		const loader = loaders[extension];
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		});
	}
	return output;
};

/**
 * @description: eslint 解析规则
 * @param {type}
 * @return: eslint解析规则
 */
exports.createLintingRule = () => ({
	test: /\.(js|vue)$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	include: [exports.resolve('src'), exports.resolve('test')],
	options: {
		cache: true,
		formatter: require('eslint-friendly-formatter'),
		emitWarning: !config.dev.showEslintErrorsInOverlay
	}
});

/**
 * @description: 检查是否有这个插件
 * @param {string} 插件名称
 * @return: true | false
 */
exports.hasPackagePlugin = (packageName) => {
	const { dependencies = {}, devDependencies = {} } = packageConfig;
	return Object.keys({ ...dependencies, ...devDependencies }).includes(packageName);
};

/**
 * @description: 获取项目绝对地址
 * @param {string} key
 * @return: value 结果
 */
exports.getPackageValue = (key) => {
	return key && packageConfig[key];
};
