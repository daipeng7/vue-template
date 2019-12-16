/*
 * @Author: daipeng
 * @Date: 2018-09-03 18:57:19
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-13 12:13:40
 * @Description: 封装request方法
 * @Company: 成都二次元动漫
 */
import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import { replaceUrl, _ } from '@/utils';
import { StatusMap, CustomCodeMap, SystemCodeMap } from './status';

const METHODS = ['get', 'post', 'put'];
const instance = axios.create();

const AJAX_DEFAULT_CONFIG = {
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json'
	}
};
let message;

// 错误处理方法
const errorHandler = res => {
	let msg = '';
	const { data } = res;
	if (StatusMap[res.status] && StatusMap[res.status].useLocalMessage) msg = StatusMap[res.status].message;
	else if (StatusMap[data.status].useLocalMessage) msg = StatusMap[data.status].message;
	else if (data && _.isString(data)) msg = data;
	else if (data && _.isObject(data)) msg = data.message || data.msg || StatusMap[data.status].message;
	if (msg) {
		message && message.close && message.close();
		message = Message.error(msg);
	}
	return Promise.reject(res);
};

// 请求拦截器
instance.interceptors.request.use(config => {
	return config;
});

// 响应拦截器
instance.interceptors.response.use(res => {
	const { data } = res;
	if (_.isObject(data)) {
		const { status } = data;
		if (CustomCodeMap.success.includes(status)) return Promise.resolve(data);
		else if (CustomCodeMap.error.includes(status)) return errorHandler(res);
		else if (status === undefined) return Promise.resolve(data);
	} else return errorHandler(res);
}, (error) => {
	if (StatusMap[error.response.status].relogin) router.replace({ name: 'login' });
	return errorHandler(error.response);
});

Object.assign(instance.defaults, AJAX_DEFAULT_CONFIG);

const request = (method) => {
	return (url) => {
		return (data) => {
			return (options) => {
				return (config) => {
					const _data = ['get'].includes(method) ? { params: data } : { data };
					const _url = replaceUrl(url, options);

					const _config = {
						...config,
						url: _url,
						method,
						..._data
					};

					return instance(_config);
				};
			};
		};
	};
};

// 请求对象
const requestInstances = METHODS.reduce((map, methodName) => {
	map[methodName] = request(methodName);
	return map;
}, { instance });

export default requestInstances;
