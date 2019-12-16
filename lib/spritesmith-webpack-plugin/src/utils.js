/*
 * @Author: daipeng
 * @Date: 2019-07-03 11:31:39
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-06 17:46:16
 * @Description: utils
 */
const fs = require('fs');
const through = require('through2');
const gutil = require('gulp-util');
const path = require('path');
const logger = require('gulplog');

const mineType = ['png'];

/**
 * @name createHash
 * @description 根据文件内容生成hash值
 */
const createHash = (options) => {
	// 创建一个让每个文件通过的 stream 通道
	const stream = through.obj(function(file, enc, cb) {
		if (file.isBuffer()) {
			debugger;
		}

		// 确保文件进去下一个插件
		this.push(file);
		// 告诉 stream 转换工作完成
		cb();
	});
	// 返回文件 stream
	return stream;
};

/**
 * @name createEntryList
 * @description 根据目录层级生成文件入口List
 *
 * @param {string} rootPath 根目录地址
 * @param {array} result 结果
 * @param {string} rootName 根图片的名字
 * @param {array} types 对哪些类型生成目录
 */
const createEntryList = function createEntryList (rootPath, result = [], rootName = 'index', types = mineType) {
	try {
		const files = fs.readdirSync(rootPath);
		const len = result.length;
		const rootItem = len ? result[len - 1] : ({ name: rootName, list: [], dirPath: rootPath });

		if (!len) result = [rootItem];

		files.forEach((e) => {
			const _absolutePath = path.resolve(rootPath, e);
			const stats = fs.statSync(_absolutePath);
			if (stats.isDirectory()) {
				result.push({ name: e, list: [], dirPath: _absolutePath });
				result = createEntryList(_absolutePath, result, rootName, mineType);
			} else if (types.includes(path.extname(_absolutePath).replace('.', ''))) rootItem.list.push(_absolutePath);
		});
		return result;
	} catch (error) {
		logger.error(error);
		throw error;
	}
};

/**
 * @name spriteTemplate
 * @description sprite css模版函数
 *
 * @param {object} spriteData
 * @param {object} opt
 * @returns {string}
 */
const spriteTemplate = function(spriteData, options = {}) {
	const { spritesheet, sprites } = spriteData;
	const { prefix, dirName, retinaIdentifier, retinaDPR, minResolution, unit } = options;
	const classNames = [];
	const timestamp = Date.now();

	const itemStyleList = sprites.map(sprite => {
		const className = `.${prefix}-${dirName}-${sprite.name}`;
		const offsetX = `${parseInt(sprite.offset_x)}${unit}`;
		const offsetY = `${parseInt(sprite.offset_y)}${unit}`;
		const width = `${parseInt(sprite.width)}${unit}`;
		const height = `${parseInt(sprite.height)}${unit}`;
		classNames.push(className);
		return `${className}{ width: ${width}; height: ${height}; background-position: ${offsetX} ${offsetY}; }`;
	});
	const commonStyle = [];
	commonStyle.push(`${classNames.join(',')} {`);
	commonStyle.push(`\tdisplay:inline-block;`);
	commonStyle.push(`\tbackground-image: url("${spritesheet.image}?t=${timestamp}");`);
	commonStyle.push(`\tbackground-size: ${spritesheet.width}${unit} ${spritesheet.height}${unit};`);
	commonStyle.push(`\tbackground-repeat: no-repeat;`);
	commonStyle.push(`}`);

	if (retinaIdentifier) {
		const multiple = retinaDPR || retinaIdentifier.match(/\d/)[0] || 2;
		commonStyle.push(`@media(-webkit-min-device-pixel-ratio:${multiple}),(min-resolution: ${minResolution}dpi){`);
		commonStyle.push(`\t${classNames.join(',')} {`);
		commonStyle.push(`\t\tdisplay:inline-block;`);
		commonStyle.push(`\t\tbackground-repeat:no-repeat;`);
		commonStyle.push(`\t\tbackground-image:url("${spriteData.retina_spritesheet.image}?t=${timestamp}");`);
		commonStyle.push(`\t\tbackground-size: ${spritesheet.width}${unit} ${spritesheet.height}${unit};`);
		commonStyle.push(`\t}`);
		commonStyle.push(`}`);
	}

	return commonStyle.join('\n') + '\n\n' + itemStyleList.join('\n');
};

module.exports = {
	createHash,
	createEntryList,
	spriteTemplate
};
