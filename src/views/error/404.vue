<!--
 * @Author:
 * @Date: 2019-12-17 10:22:46
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 11:20:58
 * @Description:
 -->
<template>
    <div class="error404">
        <div class="error404-body-con">
            <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"></Icon></span>4</div>
			<p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
			<div class="error404-btn-con">
				<button @click="goHome" type="text">返回首页</button>
				<button @click="backPage" type="primary">返回上一页</button>
			</div>
        </div>
    </div>
</template>
<script>
/*
 * @Author:
 * @Date: 2018-09-03 16:38:20
 * @LastEditors: OBKoro1
 * @LastEditTime: 2018-09-03 16:52:15
 * @Description: 404页面
 */
export default {
	name: 'Error404',
	methods: {
		backPage() {
			this.$router.go(-1);
		},
		goHome() {
			this.$router.replace({ path: '/' });
		}
	}
};
</script>
<style lang="scss">
    @keyframes error404animation {
        0% {
            transform: rotateZ(0deg);
        }
        20% {
            transform: rotateZ(-60deg);
        }
        40% {
            transform: rotateZ(-10deg);
        }
        60% {
            transform: rotateZ(50deg);
        }
        80% {
            transform: rotateZ(-20deg);
        }
        100% {
            transform: rotateZ(0deg);
        }
    }
    .error404{
        &-body-con{
            width: 700px;
            height: 500px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            &-title{
                text-align: center;
                font-size: 240px;
                font-weight: 700;
                color: #2d8cf0;
                height: 260px;
                line-height: 260px;
                margin-top: 40px;
                span{
                    display: inline-block;
                    color: #19be6b;
                    font-size: 230px;
                    animation: error404animation 3s ease 0s infinite alternate;
                }
            }
            &-message{
                display: block;
                text-align: center;
                font-size: 30px;
                font-weight: 500;
                letter-spacing: 12px;
                color: #dddde2;
            }
        }
        &-btn-con{
			text-align: center;
            padding: 20px 0;
			margin-bottom: 40px;
			button{
				font-size: 20px;
			}
        }
    }
</style>
