<!--
 * @Author:
 * @Date: 2019-11-19 10:54:54
 * @LastEditors  : VSCode
 * @LastEditTime : 2020-01-03 17:51:26
 * @Description:
 -->
<template>
    <div class="project">
		<!-- 展示内容，可删除 -->
		<div v-if="$route.name === 'app'">
			<i class="iconfont-dd"></i>
			<i class="icon-home-down"></i>
			<h5>我是应用的根页面，我可以一般功能：</h5>
			<ol class="list">
				<li>1、展示入场动画</li>
				<li>2、触发 初始化、恢复缓存数据等 一些应用一开始需要的数据</li>
				<li>3、判断用户当前的状态（使用isLogin或则userInfo等）以确定跳转的地址</li>
			</ol>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
export default {
	name: 'App',
	data () {
		return {};
	},
	created() {
		this.initApp();
	},
	methods: {
		initApp() {
			// TODO 触发各种初始化操作，一般将结果存在store中，因为就算是点击了刷新页面也会来这儿
			this.validateAppStatus();
		},
		validateAppStatus() {
			// TODO 检查当前的登录状态，可根据业务选择是否或者怎样使用
			// this.$store.dispatch('app/getUserInfo').then(res => {
			// 	// this.$router.replace({ name: 'login' });
			// });
		}
	}
};
</script>
<style lang="scss">
	.project{
		color: color(red);
		.list{
			li{
				font-size: 30px;
			}
		}
	}
</style>
