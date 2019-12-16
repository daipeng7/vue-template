/*
 * @Author: daipeng
 * @Date: 2019-10-09 19:55:24
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 15:51:19
 * @Description: utils
 */
import * as dateFns from 'date-fns';
import lodash from 'lodash';

export const _ = lodash;

export const date = dateFns;

// 检测数据类型
export const objectToString = (type) => Object.prototype.toString.call(type);

/**
 * 校验数据类型
*/

// 汉字正则
export const chineseRegExp = /^[\u2E80-\u9FFF]+$/;

// 是否为汉字
export const isChinese = (str) => chineseRegExp.test(str);

/**
 * 替换url中的参数，如
 *      /user/:userId  ===>  /user/1
 *
 * @param {string} url
 * @param {object} params
 * @returns url
 */
export const replaceUrl = (url, params) => {
	if (!lodash.isString(url) || !url || !lodash.isObject(params)) return;
	return url.replace(/\/:(\w+)/g, (m, n) => {
		return `/${params[n]}`;
	});
};

/**
 * 时间格式化
 *
 * @param {*} time
 * @param {string} [fmt='yyyy.MM.dd hh:mm:ss']
 * @returns
 */
export const dateFormat = (time, fmt = 'yyyy-MM-dd HH:mm:ss') => {
	let objectDate;
	if (time instanceof Date) objectDate = time;
	else objectDate = new Date(time);

	return dateFns.format(objectDate, fmt);
};

/**
 * 过空字符串
 *
 * @param {*} data
 * @returns
 */
export const filterEmptyString = (data) => {
	if (lodash.isObject(data)) {
		Object.keys(data).forEach(key => {
			if (data[key] === null) Reflect.deleteProperty(data, key);
			else if (lodash.isObject(data[key])) data[key] = filterEmptyString(data[key]);
		});
	}
	return data;
};

/**
 * 给url加时间戳
 *
 * @param {*} data
 * @returns
 */
export const addTimestamp = (url) => {
	const timestamp = new Date().getTime();
	if (/\?+/.test(url)) return `${url.split('?')[0]}?time=${timestamp}`;
	else return `${url}?time=${timestamp}`;
};

/**
 * @description: 获取某天的时间界限
 * @param {string} type 'start'|'end' 默认开始
 * @param {Date} date 默认今天
 * @return: {Date}
 */
export const getDateBound = (type = 'start', today = new Date()) => {
	if (type === 'start') return dateFns.startOfDay(today);
	else if (type === 'end') return dateFns.endOfDay(today);
};

export const on = (function() {
	if (document.addEventListener) {
	  return function(element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false);
			}
	  };
	} else {
	  return function(element, event, handler) {
			if (element && event && handler) {
				element.attachEvent('on' + event, handler);
			}
	  };
	}
})();

export function hasClass(el, cls) {
	if (!el || !cls) return false;
	if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
	if (el.classList) {
	  return el.classList.contains(cls);
	} else {
	  return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}
};

export function addClass(el, cls) {
	if (!el) return;
	var curClass = el.className;
	var classes = (cls || '').split(' ');

	for (var i = 0, j = classes.length; i < j; i++) {
	  var clsName = classes[i];
	  if (!clsName) continue;

	  if (el.classList) {
			el.classList.add(clsName);
	  } else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName;
	  }
	}
	if (!el.classList) {
	  el.className = curClass;
	}
};

export const loadJS = (path) => {
	return new Promise((resolve, reject) => {
		const scriptDOM = document.createElement('script');
		scriptDOM.type = 'text/javascript';
		scriptDOM.src = path;
		document.getElementsByTagName('head')[0].appendChild(scriptDOM);
		scriptDOM.onload = resolve;
		scriptDOM.onerror = reject;
	});
};
