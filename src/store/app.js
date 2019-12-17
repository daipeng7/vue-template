/*
 * @Author:
 * @Date: 2019-12-17 14:20:55
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 15:03:28
 * @Description:
 */
import fetch from '@/fetch';
import { router } from '@/main';

const initState = () => ({
	userInfo: {},
	menuList: []
});

export default {
	namespaced: true, // 命名空间，在接入store数据的时候需要带上名字
	state: initState(),
	getters: {
	},
	mutations: {
		setUserInfo(state, payload) {
			// 因为角色type响应值类型不固定，所以使用固定类型
			if (payload.role_type) payload.role_type = +payload.role_type;
			state.userInfo = { ...state.userInfo, ...payload };
		},
		resetUserInfo(state, payload) {
			state.userInfo = payload || initState().userInfo;
		}
	},
	actions: {
		getUserInfo(context) {
			return fetch('islogin').then((res = {}) => {
				const { commit, dispatch, getters } = context;
				commit('setUserInfo', res.data);
				// 全局预置请求
				const prevFetch = [
					// dispatch('account/getRoleList', null, { root: true }) // 其他store模块的actions
				];

				// 获取完登录信息后需要设置全局的共享数据
				return Promise.all(prevFetch).then(() => {
					// if (['/login', '/'].includes(location.pathname)) router.replace({ name: 'home' }); // 控制跳转页面
					return res.data;
				});
			}).catch(() => {
				// if (location.pathname !== '/login') router.replace({ name: 'login' });
			});
		},
		logout(context) {
			return fetch('logout').then((res) => {
				context.commit('resetUserInfo');

				// 注销登录信息后需要重置其他模块的全局共享数据
				// context.commit('account/resetRoleList', null, { root: true });

				router.replace({ name: 'login' });
				return res.data;
			});
		}
	}
};
