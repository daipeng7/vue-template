/*
 * @Author:
 * @Date: 2019-12-16 17:11:37
 * @LastEditors  : VSCode
 * @LastEditTime : 2020-01-14 14:30:04
 * @Description: 设置根元素字体大小，配合px2rem插件，在入口文件倒入
 */
const config = require('./index');
const { px2rem } = config.default;
(function(window, document) {
	if (!px2rem) return;
	let dpr = window.devicePixelRatio || 1;
	// iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
	if (dpr >= 3) {
		dpr = 3;
	} else if (dpr >= 2) {
		dpr = 2;
	} else {
		dpr = 1;
	}
	const docEle = document.documentElement;
	const scale = 1 / dpr ;
	const metaDOM = document.createElement('meta');
	metaDOM.setAttribute('name', 'viewport');
	metaDOM.setAttribute('content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no>');
	document.head.appendChild(metaDOM);
	//  现在大部分手机浏览器都支持 onorientationchange;如果不支持，可以使用原始的 resize
	var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
	const fn = function() {
		// 获取屏幕的css宽度（比如：iPhone6 就是375px）
		var width = docEle.clientWidth;
		docEle.style.fontSize = (width * px2rem.rootValue) / px2rem.designWidth + 'px';
	};
	window.addEventListener(evt, fn, false);
	// DOM加载完成触发该事件
	document.addEventListener('DOMContentLoaded', fn, false);
}(window, document));
