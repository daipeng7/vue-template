/*
 * @Author: daipeng
 * @Date: 2019-11-20 20:43:58
 * @LastEditors: VSCode
 * @LastEditTime: 2019-11-20 20:44:34
 * @Description: vue指令文件
 */
const directives = [];

export const initDirective = (Vue) => {
	directives.forEach(item => Vue.directive(item.name, item.options));
};
