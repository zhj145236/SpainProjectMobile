<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				registrar cuenta
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">nombre de usuario</text>
					<input 
						type="text" 
						:value="membername" 
						placeholder="favor indicar nombre de usuario"
						maxlength="50"
						data-key="membername"
						@input="inputChange"
					/>
				</view>
				<!-- <view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view> -->
				<view class="input-item">
					<text class="tit">contrasena</text>
					<input 
						type="mobile" 
						value="" 
						placeholder="favor ingresar contrasena"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toRegist"
					/>
				</view>
				<view class="input-item">
					<text class="tit">confirma contrasena</text>
					<input 
						type="mobile" 
						value="" 
						placeholder="favor ingresar contrasena nuevamente"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password2"
						@input="inputChange"
						@confirm="toRegist"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegist" :disabled="logining" v-if="btnshow">registrar</button>
			<button class="confirm-btn" style="opacity: 0.5;" v-else>registrar</button>
			<view class="forget-section" @click="toAgreement">
				acepta todo los punto del Protocolo de registro de usuarios
			</view>
		</view>
		<view class="register-section">
			usuario exsiste?
			<text @click="toLogin">ir al inicio</text>
		</view>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default{
		data(){
			return {
				membername: '',
				mobile: '',
				password: '',
				password2: '',
				logining: false,
				btnshow: true,
			}
		},
		onLoad(){
			
		},
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				if(this.membername == ''){
					uni.showModal({
						content: 'favor indicar nombre de usuario',
						showCancel: false
					})
					return
				}
				// if(this.mobile == ''){
				// 	uni.showModal({
				// 		content: '请输入手机号码',
				// 		showCancel: false
				// 	})
				// 	return
				// }
				// if (!/^1\d{10}$/.test(this.mobile)) {
				// 	uni.showModal({
				// 		content: '手机号码填写错误',
				// 		showCancel: false
				// 	})
				// 	return
				// }
				if(this.password == ''){
					uni.showModal({
						content: 'favor ingresar contrasena',
						showCancel: false
					})
					return
				}
				if(this.password2 == ''){
					uni.showModal({
						content: 'favor ingresar contrasena nuevamente',
						showCancel: false
					})
					return
				}
				if(this.password != this.password2){
					uni.showModal({
						content: 'dos contraseñas de entrada inconsistentes',
						showCancel: false
					})
					return
				}
				let that = this;
				that.btnshow = false;
				core.get('AppMember/register',{membername:this.membername,password:this.password},function(data){
					uni.hideLoading();
					if(data.state == 0){
						that.btnshow = true;
						uni.showModal({
							content: data.msg,
							showCancel: false
						})
						return
					}else{
						uni.showModal({
							content: 'registrado correctamente, ir al inicio',
							showCancel: false,
							success: function (res) {
								uni.navigateTo({
									url: `/pages/public/login`
								})
							}
						})
					}
				});
			},
			toLogin(){
				uni.navigateTo({
					url: `/pages/public/login`
				})
			},
			toAgreement(){
				uni.navigateTo({
					url: `/pages/user/agreement?code=agreement`
				})
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
		font-family: $font-family;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
