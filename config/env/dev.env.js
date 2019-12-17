/*
 * @Author:
 * @Date: 2019-11-19 14:45:49
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-11 14:10:23
 * @Description: 环境变量
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"'
});
