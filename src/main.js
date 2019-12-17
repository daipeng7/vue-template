/*
 * @Author:
 * @Date: 2018-09-03 11:29:10
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 14:42:32
 * @Description: 应用入口文件
 */
import Vue from 'vue';
import { initGlobal } from '@/global';
import { initDirective } from '@/directives';
import { initFilter } from '@/filters';
import { initPlugin } from '@/plugins';
import { initRouter } from '@/router';
import { initStore } from '@/store';

/**
 * 全局样式引入
 * 	core样式通过sass.data注入到所有的sass、vue文件中
 */
import '@/style/_index.scss';

initGlobal(Vue);
initDirective(Vue);
initFilter(Vue);
initPlugin(Vue);

// 暴露路由对象，可以在其他地方使用方便控制跳转方法，比如请求拦截器等
export const router = initRouter(Vue);
// 暴露store对象，可以在其他地方使用store方法
export const store = initStore(Vue);

new Vue({
	el: '#app',
	router,
	store,
	template: '<router-view></router-view>'
});
