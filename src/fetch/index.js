/*
 * @Author:
 * @Date: 2018-09-03 18:04:15
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 14:08:46
 * @Description: 输出请求方法
 * @Company:
 */
import apiMap from '@/fetch/apiMap';
import { filterEmptyString } from '@/utils';

/**
 * 统一封装ajax入口
 *
 * @param {*} name      接口名称
 * @param {*} data      请求数据
 * @param {*} config    请求配置，非必填
 * @param {*} options   操作参数，非必填
 */
const apiHandle = (name = '', data = {}, options = {}, config = {}) => {
	data = filterEmptyString(data);
	if (apiMap[name]) {
		return apiMap[name](data)(options)(config);
	} else {
		return Promise.reject(new Error('请求地址错误'));
	}
};

export default apiHandle;
