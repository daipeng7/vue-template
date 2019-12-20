/*
 * @Author:
 * @Date: 2019-12-19 20:33:16
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-19 20:33:58
 * @Description:
 */
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Component from '../App';

const localVue = createLocalVue();

describe('App Page test:', () => {
	test('create', () => {
		const wrapper = shallowMount(Component, {
			localVue,
			stubs: ['router-view'],
			mocks: {
				$route: {
					name: 'app'
				}
			}
		  });
		expect(wrapper.isVueInstance()).toBeTruthy();
	});
});
