<!--
 * @Author:
 * @Date: 2019-12-17 10:46:42
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 15:44:14
 * @Description: home页路由下的子页面，但是他还带有子页面
 -->
<template>
	<div class="home-subchild">
		<div v-if="$route.name === 'subchild'">
			<div>我是属于home页下的子页面，但是我还带有子页面</div>
			<div>可以些这个页面的内容，如果没有内容就直接一个 router-view 标签，配合routes配置里面的children子路由就可以了（但是那样这个页面就只是一个中转页面）</div>
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
	.home-subchild{

	}
</style>
