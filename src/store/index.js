/*
 * @Author:
 * @Date: 2019-12-17 14:19:53
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 14:41:48
 * @Description:
 */
import Vuex from 'vuex';
import app from './app';

export const initStore = (Vue) => {
	Vue.use(Vuex);
	const store = new Vuex.Store({
		modules: {
			app
		}
	});
	return store;
};
