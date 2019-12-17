<!--
 * @Author:
 * @Date: 2019-12-17 10:42:19
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 15:40:03
 * @Description: home页主文件
 -->
<template>
	<div class="home">
		<!-- 展示内容，可删除 -->
		<div v-if="$route.name === 'home'">
			<h5>我是home页的入口页</h5>
			<ol>
				<li>1、首页种包含有子页面的情况，可以用来做一些初始化工作</li>
				<li>2、可以用来做一下home这个功能入口页面的内容展示或者动画等</li>
			</ol>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
	.home{

	}
</style>
