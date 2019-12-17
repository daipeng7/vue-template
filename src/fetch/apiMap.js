
/*
 * @Author:
 * @Date: 2018-09-03 18:31:30
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 14:15:24
 * @Description: 接口map，可分割
 * @Company:
 */
import request from '@/fetch/request';
const { get, post, put } = request;
const apiMap = {
	/**
     * basic
     */
	isLogin: get('/v1/basic/isLogin') // 检查是否登录
};

export default apiMap;
