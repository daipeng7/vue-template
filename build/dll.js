/*
 * @Author:
 * @Date: 2019-11-20 15:52:20
 * @LastEditors: VSCode
 * @LastEditTime : 2020-02-16 11:54:57
 * @Description:
 */
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const ora = require('ora');
const path = require('path');
const webpack = require('webpack');
const hash = require('object-hash');
const MemoryFileSystem = require('memory-fs');
const utils = require('./utils');
const webpackDllConfig = require('../config/webpack.dll.config');

const createDllConfig = (outputDir, chunks = [], fs) => {
	const emitedConfig = chunks.reduce((res, chunk) => {
		const { name, hash } = chunk;
		const chunkDir = path.resolve(outputDir, name);
		const files = fs.readdirSync(chunkDir);
		const dllPath = path.resolve(chunkDir, files.find(fileName => `${name}.dll.js` === fileName));
		const manifestPath = path.resolve(chunkDir, files.find(fileName => `${name}.manifest.json` === fileName));

		if (!fsExtra.existsSync(chunkDir)) fsExtra.mkdirpSync(chunkDir);

		fsExtra.writeFileSync(dllPath, fs.readFileSync(dllPath));
		fsExtra.writeFileSync(manifestPath, fs.readFileSync(manifestPath));

		res[name] = { hash, dllPath, manifestPath };
		return res;
	}, {});
	return emitedConfig;
};

const createDllPromise = function() {
	return new Promise(function(resolve, reject) {
		const currentIdentity = utils.getEntryModuleIdentity(webpackDllConfig.entry);
		try {
			const compiler = webpack(webpackDllConfig);
			const spinner = ora();
			let oldIndtity;
			try {
				oldIndtity = require(path.resolve(webpackDllConfig.output.path, 'identity.json'));
			} catch (error) {
				oldIndtity = {};
			}

			const currentIdentityHash = hash(currentIdentity);
			if (currentIdentityHash === oldIndtity.hash) return resolve({ compiler, dllList: oldIndtity.dllList });

			// 替换文件系统
			compiler.outputFileSystem = new MemoryFileSystem();

			spinner.start('Start compile dll asset service...\n');
			// 生成动态链接文件结束并写入文件中触发事件
			compiler.hooks.done.tapAsync('dllFinish', function(state, errCallback) {
				const err = errCallback();
				if (err) {
					console.log(chalk.red(err));
					reject(compiler);
				} else {
					spinner.stop();
					spinner.succeed(`Stop compile dll asset service。 ${state.endTime - state.startTime}ms\n`);

					const dllConfig = createDllConfig(compiler.outputPath, state.compilation.chunks, compiler.outputFileSystem);
					const dllList = Object.values(dllConfig);

					fsExtra.writeJSONSync(path.resolve(webpackDllConfig.output.path, 'identity.json'), { hash: currentIdentityHash, dllList });

					resolve({ compiler, dllList });
				}
			});
			compiler.hooks.failed.tap('dllFaild', reject);
			spinner.start();
			compiler.run();
		} catch (error) {
			console.log(chalk.red(error));
		}
	});
};
module.exports = createDllPromise;
