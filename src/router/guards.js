/*
 * @Author:
 * @Date: 2019-12-17 11:27:56
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 14:51:52
 * @Description: 路由守卫
 */

// 路由守卫
export const beforeEach = (to, from, next) => {
	// 可以每一次跳转动作是否执行，怎样执行。一般用于权限、登录是否过期等
	next();
};

export const initGuards = (router) => {
	router.beforeEach(beforeEach);
};
