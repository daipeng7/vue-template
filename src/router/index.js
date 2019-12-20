/*
 * @Author:
 * @Date: 2019-11-26 17:04:48
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-19 20:11:40
 * @Description: 路由主文件
 */
import VueRouter from 'vue-router';
import App from '@/views/App';
import Login from '@/views/login';
import Home from '@/views/home';
import { initGuards } from './guards';

// 滚动条行为
const scrollBehavior = (to, from, savedPosition) => {
	if (savedPosition) {
		return savedPosition;
	} else {
		return { x: 0, y: 0 };
	}
};

// 异常页面路由
export const errorPageRoutes = [
	{
		name: 'error_404',
		path: '/*',
		component: resolve => require(['@/views/error/404'], resolve)
	}
];

// 二级页面, 后面每增加一层子级页面，就需要children，然后页面上需要router-view
export const homeMenuRoutes = [
	{
		name: 'child',
		path: '/home/child',
		title: 'home子页面，无后代',
		icon: 'el-icon-order',
		meta: {
			title: 'home子页面，无后代'
		},
		component: resolve => require(['@/views/home/child'], resolve)
	},
	{
		name: 'subchild',
		path: '/home/subchild',
		title: 'home子页面，有后代',
		icon: 'el-icon-order',
		meta: {
			title: 'home子页面，有后代'
		},
		component: resolve => require(['@/views/home/subChild/index'], resolve),
		children: [
			{
				name: 'offspring',
				path: '/home/subchild/offspring',
				title: 'home后代页面',
				icon: 'el-icon-order',
				meta: {
					title: 'home后代页面'
				},
				component: resolve => require(['@/views/home/subChild/offspring'], resolve)
			}
		]
	}
];

// 一级路由
export const indexRoutes = [
	{
		name: 'login',
		path: '/login',
		meta: {
			title: '登录'
		},
		component: Login
	},
	{
		name: 'home',
		path: '/home',
		redirect: '/home/child', // 输入/home直接定向到child页面
		component: Home,
		children: [...homeMenuRoutes]
	}
];

// 根路由
export const rootRoutes = {
	base: '/',
	mode: 'history',
	linkActiveClass: 'router-link-active',
	linkExactActiveClass: 'router-link-exact-active',
	scrollBehavior,
	routes: [
		{
			name: 'app',
			path: '/',
			title: '应用根页面',
			icon: 'el-icon-order',
			meta: {
				title: '应用根页面'
			},
			component: App,
			children: [
				...indexRoutes
			]
		},
		...errorPageRoutes
	]
};

// 初始化路由方法，
export const initRouter = (Vue) => {
	Vue.use(VueRouter);
	const router = new VueRouter(rootRoutes);
	// 初始化路由守卫
	initGuards(router);
	return router;
};
