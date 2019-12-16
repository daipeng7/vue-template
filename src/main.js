/*
 * @Author: daipeng
 * @Date: 2018-09-03 11:29:10
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-16 14:04:00
 * @Description: 应用入口文件
 */
import Vue from 'vue';
import App from '@/App';
import { initGlobal } from '@/global';
import { initDirective } from '@/directives';
import { initFilter } from '@/filters';
import { initPlugin } from '@/plugins';

/**
 * 全局样式引入
 * 	core样式通过sass.data注入到所有的sass、vue文件中
 */
import '@/style/_index.scss';

initGlobal(Vue);
initDirective(Vue);
initFilter(Vue);
initPlugin(Vue);

new Vue({
	el: '#app',
	components: { App },
	template: '<App />'
});
