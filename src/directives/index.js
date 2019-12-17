/*
 * @Author:
 * @Date: 2019-11-20 20:43:58
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 17:53:13
 * @Description: vue指令文件
 */
import Scroll from './scroll';
const directives = [
	Scroll
];

export const initDirective = (Vue) => {
	directives.forEach(item => Vue.directive(item.name, item.options));
};
