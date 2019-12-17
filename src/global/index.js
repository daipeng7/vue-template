/*
 * @Author:
 * @Date: 2019-11-20 20:47:04
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 17:25:09
 * @Description:
 */
import fetch from '@/fetch';
import * as utils from '@/utils';

// 全局变量列表
const variables = [
	{ name: '$fetch', value: fetch },
	{ name: '$utils', value: utils }
];

export const initGlobal = (Vue) => {
	variables.forEach(item => (Vue.prototype[item.name] = item.value));
};
