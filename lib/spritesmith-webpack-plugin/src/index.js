/*
 * @Author: daipeng
 * @Date: 2019-12-02 20:33:35
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-13 15:08:06
 * @Description: SpriteSmithWebpackPlugin
 */
const spritemith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const $ = require('gulp-load-plugins')();
const chokidar = require('chokidar');
const gulp = require('gulp');
var series = require('run-sequence').use(gulp);
const fs = require('fs');
const path = require('path');
const ora = require('ora');

const { createEntryList, spriteTemplate } = require('./utils');

class SpriteSmithWebpackPlugin {
	constructor(config) {
		this.config = Object.assign({
			prefix: 'icon',
			rootPrefix: 'index',
			resultImageType: 'png',
			resultCssType: 'css',
			padding: 6,
			retinaIdentifier: '',
			minResolution: 192,
			retinaDPR: 2,
			unit: 'px',
			hash: false,
			watch: false,
			cssTemplate: null,
			success: null
		}, config);
		this.watcher = null;
	}

	apply(compiler) {
		compiler.hooks.beforeRun.tapAsync('dd', (compiler, callback) => {
			debugger;
		});
		compiler.hooks.emit.tapAsync('SpriteSmithWebpackPlugin', (compiler, callback) => {
			this.spinner = ora('sprite build...').start();
			this.spriteStart().then(res => {
				this.spinner.succeed('sprite is builded!');
				callback();
			});
		});
	}

	/**
	 * @name spriteStart
	 * @description sprite 任务开启函数
	 *
	 * @param {object} options
	 * @returns {function}
	 */
	spriteStart() {
		const { paths, watch } = this.config;
		const list = createEntryList(paths.source);
		this.cleanHistory(paths.result);
		return this.batchSpriteHandler(list).then(res => {
			if (watch) this.spriteWatch(list);
			return res;
		});
	}

	/**
	 * @name spriteHandler
	 * @description sprite生产函数
	 * @param {object} options 根据目录分割的sprite数据
	 * 		- name 目录名称
	 * 		- list 图片路径列表
	 * @returns {Promise}
	 */
	spriteHandler(options) {
		const that = this;
		const { name, list, dirPath } = options;
		if (!list.length) return Promise.resolve();
		const { paths, padding, retinaIdentifier, resultImageType, cssTemplate, resultCssType, hash } = this.config;
		const { result, resultImage, resultCss } = paths;
		let { imgName, cssName, imageAbsolute, cssAbsolute, imageAbsoluteReg, cssAbsoluteReg } = this.getResultData(name);
		let retinaImgName = '';
		const originImgName = path.basename(imgName);
		let originRetinaImgName = '';

		const spritesmithData = {
			imgName,
			cssName,
			padding,
			cssTemplate(data) {
				if (cssTemplate && typeof cssTemplate !== 'function') throw TypeError('cssTemplate is not a function');
				return cssTemplate || spriteTemplate(data, { dirName: name, ...that.config });
			}
		};

		// 带有retina标示
		if (retinaIdentifier) {
			const suffix = `${retinaIdentifier}.${resultImageType}`;
			spritesmithData.retinaSrcFilter = path.join(dirPath, `${path.sep}*${suffix}`);
			spritesmithData.retinaImgName = imgName.replace(/(?<=\w+)(\-\w+)/gi, '').replace(`.${resultImageType}`, suffix);
			originRetinaImgName = path.basename(spritesmithData.retinaImgName);
		}
		// 开始生产
		return new Promise((resolve, reject) => {
			// 清除旧数据
			this.cleanHistory(imageAbsoluteReg);
			this.cleanHistory(cssAbsoluteReg);
			const task = gulp.src(list).pipe(spritemith(spritesmithData)).pipe($.buffer());
			if (hash) task.pipe($.hash());
			task.on('data', file => {
				const { basename } = file;
				if (new RegExp(`\.${resultImageType}$`, 'gi').test(basename)) {
					if (new RegExp(`${name}${retinaIdentifier}(\\-\\w+)?\\.${resultImageType}`, 'gi').test(basename)) retinaImgName = basename;
					if (new RegExp(`${name}(\\-\\w+)?\\.${resultImageType}`, 'gi').test(basename)) imgName = basename;
					imageAbsolute = path.resolve(resultImage, basename);
				} else if (new RegExp(`\.${resultCssType}$`, 'gi').test(basename)) {
					cssName = basename;
					cssAbsolute = path.resolve(resultCss, basename);
					let content = file.contents.toString();
					content = content.replace(new RegExp(originRetinaImgName, 'gi'), retinaImgName);
					content = content.replace(new RegExp(originImgName, 'gi'), imgName);
					file.contents = Buffer.from(content);
				}
			}).pipe(gulp.dest(result).on('end', resolve).on('error', reject));
			return task;
		}).then(res => {
			return { imgName, cssName, imageAbsolute, cssAbsolute };
		});
	}

	/**
	 * @name cleanHistory
	 * @description 清除
	 * @param {*} path
	 */
	cleanHistory(path) {
		try {
			rimraf.sync(path);
		} catch (error) {
			this.spinner.fail(error);
		}
	}

	/**
	 * @name getResultData
	 * @description 根据目录结构获取目录信息
	 * @param {string} dirName
	 * @param {boolean} hasHash 有哈希值的需要就行替换
	 * @returns
	 */
	getResultData(dirName) {
		const { paths, resultImageType, resultCssType, retinaIdentifier } = this.config;
		const { result, resultImage, resultCss } = paths;
		let imgName = path.relative(result, `${resultImage}/${dirName}.${resultImageType}`);
		let cssName = path.relative(result, `${resultCss}/${dirName}.${resultCssType}`);
		try {
			const cssFiles = fs.readdirSync(resultCss);
			const imageFiles = fs.readdirSync(resultImage);
			const getReg = () => new RegExp(`${dirName}(${retinaIdentifier})?(\\-\\w+)?`, 'gi');
			const hasImageName = imageFiles.find(p => getReg().test(p));
			const hasCssName = cssFiles.find(p => getReg().test(p));
			if (hasImageName) imgName = path.relative(result, `${resultImage}/${hasImageName}`);
			if (hasCssName) cssName = path.relative(result, `${resultCss}/${hasCssName}`);
		} catch (error) {}

		return {
			imgName: imgName.replace(/\-\w+/gi, ''),
			cssName: cssName.replace(/\-\w+/gi, ''),
			imageAbsolute: path.resolve(result, imgName),
			cssAbsolute: path.resolve(result, cssName),
			imageAbsoluteReg: path.relative(result, `${resultImage}/${dirName}(${retinaIdentifier})?(\\-\\w+)?.${resultImageType}`),
			cssAbsoluteReg: path.relative(result, `${resultCss}/${dirName}(\\-\\w+)?.${resultCssType}`)
		};
	}

	/**
	 * @name batchSpriteHandler
	 * @description 批量sprite生产函数
	 * @param {object} options 根据目录分割的sprite数据
	 * 		- name 目录名称
	 * 		- list 图片路径列表
	 * @returns {Promise}
	 */
	batchSpriteHandler(list = []) {
		return Promise.all(list.map((item) => this.spriteHandler(item))).then(res => {
			const list = res.filter(Boolean);
			const { success } = this.config;
			if (success && typeof success === 'function') success(list);
			return list;
		}).catch(error => {
			this.spinner.fail(error);
		});
	}

	/**
	 * @name spriteWatch
	 * @description sprite监控
	 * @param {array} list 文件目录列表
	 */
	spriteWatch() {
		const { paths, rootPrefix } = this.config;
		const watcher = chokidar.watch(paths.source, {
			ignoreInitial: true,
			persistent: true
		});

		watcher.on('all', (evenType, foldPath) => {
			const absolutePath = path.resolve(paths.source, foldPath);
			if (absolutePath.match('.DS_Store')) return;
			let foldName = '';

			const pathData = path.parse(absolutePath);
			if (pathData.dir === paths.source) foldName = '';
			else foldName = path.dirname(absolutePath.replace(paths.source + '/', ''));

			const list = createEntryList(path.resolve(paths.source, foldName), [], foldName || rootPrefix);
			this.batchSpriteHandler(list);
		}).on('ready', () => this.spinner.info('Initial scan sprite complete. Ready for changes'));
	}
}

module.exports = SpriteSmithWebpackPlugin;
