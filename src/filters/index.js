/*
 * @Author: daipeng
 * @Date: 2019-10-11 15:52:11
 * @LastEditors: VSCode
 * @LastEditTime: 2019-11-20 20:46:36
 * @Description: vue过滤器文件
 */

// 账号密码过滤器
export const accountPasswordFilter = (value) => {
	return /^\w{6,23}$/ig.test(value);
};

export const initFilter = (Vue) => {
	[
		{ name: 'accountPasswordFilter', fn: accountPasswordFilter }
	].forEach(item => {
		Vue.filter(item.name, item.fn);
	});
};
