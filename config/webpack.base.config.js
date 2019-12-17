/*
 * @Author:
 * @Date: 2019-11-19 11:26:47
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 21:02:17
 * @Description: webpack 共用基础配置
 */
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const config = require('./index');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs');
const ElementThemeWebpackPlugin = require('element-theme-webpack-plugin');
const SpritesmithWebpackPlugin = require('spritesmith-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve, createLintingRule, hasPackagePlugin } = utils;
const isProduction = process.env.NODE_ENV === 'production';
const cssMapEnabled = isProduction ? config.build.cssSourceMap : config.dev.cssSourceMap;

const needIconFont = fs.existsSync(resolve('src/assets/iconfont'));
const needSprite = fs.existsSync(resolve('src/assets/sprite'));
const hasElementUI = hasPackagePlugin('element-ui');
const { assetsRoot, assetsCSSDirectory, assetsJSDirectory, usePostCSS, px2rem } = config.default;

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		app: [
			(usePostCSS && px2rem) && './config/setRootSzie.js',
			'./src/main.js'
		].filter(Boolean)
	},
	output: {
		path: assetsRoot,
		publicPath: '/',
		filename: `${assetsJSDirectory}${path.sep}[name].js`,
		chunkFilename: `${assetsJSDirectory}${path.sep}[name].[chunkhash].js`
	},
	resolve: {
		extensions: ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
		alias: {
			vue$: 'vue/dist/vue.esm.js',
			'@': resolve('src')
		}
	},
	module: {
		rules: [
			...(config.dev.useEslint ? [createLintingRule()] : []),
			...utils.styleLoaders({
				sourceMap: cssMapEnabled,
				usePostCSS: usePostCSS,
				extract: isProduction,
				// 注入sass配置
				prependData: '@import "~@/style/core/index.scss";'
			}),
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					cssSourceMap: cssMapEnabled,
					cacheBusting: config.dev.cacheBusting,
					hotReload: !isProduction,
					transformAssetUrls: {
						video: ['src', 'poster'],
						source: 'src',
						img: 'src',
						image: ['xlink:href', 'href'],
						use: ['xlink:href', 'href']
					}
				}
			},
			{
				test: /\.js$/,
				use: ['cache-loader', 'babel-loader'],
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
				exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file))
			},
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					fallback: {
						loader: 'file-loader',
						options: {
							name: utils.assetsPath('images/[name].[hash:7].[ext]')
						}
					}
				}
			},
			{
				test: /\.(svg)(\?.*)?$/,
				loader: 'file-loader',
				options: {
					name: utils.assetsPath('images/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					fallback: {
						loader: 'file-loader',
						options: {
							name: utils.assetsPath('media/[name].[hash:7].[ext]')
						}
					}
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					fallback: {
						loader: 'file-loader',
						options: {
							name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
						}
					}
				}
			}
		]
	},
	plugins: [
		// 严格检查模块路径大小写
		new CaseSensitivePathsPlugin(),
		// 将.js/.css等规则应用到.vue文件中的<script>和<style>内容中
		new VueLoaderPlugin(),
		// index.html模版配置
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: utils.resolve('./public/index.html'),
			inject: true,
			templateParameters: {
				title: utils.getPackageValue('title'),
				meta: {
					keywords: 'meta关键字',
					description: '站点描述'
				},
				favicon: '/static/images/favicon.ico'
			},
			minify: {
				removeComments: isProduction,
				collapseWhitespace: isProduction,
				removeAttributeQuotes: isProduction
			},
			chunksSortMode: 'dependency'
		}),
		// 检查如果有字体图标文件夹，自动生成字体图标
		needIconFont && new WebpackIconfontPluginNodejs({
			fontName: 'custom-iconfont',
			svgs: resolve('./src/assets/iconfont/*.svg'),
			fontsOutput: resolve('./src/style/iconfont/fonts/'),
			cssOutput: resolve('./src/style/iconfont/iconfont.[hash:5].css'),
			jsOutput: false,
			htmlOutput: false,
			template: 'scss',
			cssPrefix: 'iconfont'
		}),
		needSprite && new SpritesmithWebpackPlugin({
			prefix: 'icon',
			rootPrefix: 'index',
			resultImageType: 'png',
			resultCssType: 'css',
			padding: 6,
			retinaIdentifier: '@2x',
			retinaDPR: 2,
			unit: 'px',
			hash: false,
			watch: !isProduction,
			paths: {
				source: resolve('src/assets/sprite'),
				result: resolve('src/style/sprite'),
				resultCss: resolve('src/style/sprite/css'),
				resultImage: resolve('src/style/sprite/images')
			},
			success() {
				const indexContent = [];
				const indexPath = resolve('src/style/sprite/css/index.css');
				const cssPath = resolve('src/style/sprite/css');
				if (!fs.existsSync(cssPath)) return;
				const files = fs.readdirSync(cssPath) || [];
				files.forEach(file => {
					if (path.basename(indexPath) !== file) indexContent.push(`@import "./${path.basename(file)}";`);
				});
				fs.writeFileSync(indexPath, indexContent.join('\n'));
			}
		}),
		// 检查是否使用ElementUI，自动生成自定义主题
		hasElementUI && new ElementThemeWebpackPlugin({
			config: resolve('./src/style/element-ui/element-variables.scss'),
			out: resolve('./src/style/element-ui/theme'),
			minimize: isProduction,
			browsers: ['ie > 9', 'last 2 versions']
			// components: [], // 默认all
			// watch: false
		}),
		isProduction && new MiniCssExtractPlugin({
			filename: `${assetsCSSDirectory}${path.sep}[name].[hash].css`,
			chunkFilename: `${assetsCSSDirectory}${path.sep}[id].[hash].css`
		})
	].filter(Boolean),
	node: {
		setImmediate: false,
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
};
