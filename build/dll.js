/*
 * @Author:
 * @Date: 2019-11-20 15:52:20
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 19:13:07
 * @Description:
 */
const chalk = require('chalk');
const fs = require('fs');
const ora = require('ora');
const path = require('path');
const webpack = require('webpack');
const webpackDllConfig = require('../config/webpack.dll.config');

const createDllPromise = function() {
	return new Promise(function(resolve, reject) {
		try {
			const compiler = webpack(webpackDllConfig);
			const spinner = ora('Start compile dll asset service...\n');
			// 生成动态链接文件结束并写入文件中触发事件
			compiler.hooks.done.tapAsync('dllFinish', function(state, errCallback) {
				const err = errCallback();
				if (err) {
					console.log(chalk.red(err));
					reject(compiler);
				} else {
					spinner.stop();
					spinner.succeed(`Stop compile dll asset service。 ${state.endTime - state.startTime}ms\n`);
					const dllFiles = fs.readdirSync(compiler.outputPath);
					const dllList = dllFiles.map(function(dirName) {
						const dirPath = path.resolve(compiler.outputPath, dirName);
						const files = fs.readdirSync(dirPath);

						return {
							dllPath: path.resolve(dirPath, files.find(fileName => `${dirName}.dll.js` === fileName)),
							manifestPath: path.resolve(dirPath, files.find(fileName => `${dirName}.manifest.json` === fileName))
						};
					});
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
