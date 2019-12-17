/*
 * @Author:
 * @Date: 2019-11-20 20:47:04
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 17:11:58
 * @Description:
 */
import fetch from '@/fetch';
import * as utils from '@/utils';

const variables = [
	{ name: '$fetch', value: fetch },
	{ name: '$utils', value: utils }
];

export const initGlobal = (Vue) => {
	variables.forEach(item => (Vue.prototype[item.name] = item.value));
};
