/*
 * @Author:
 * @Date: 2019-12-17 17:24:59
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 17:30:00
 * @Description: 判断如果是移动端使用
 */
const FastClick = require('fastclick');

(function(window, document) {
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			FastClick.attach(document.body);
		}, false);
	}
})(window, document);
