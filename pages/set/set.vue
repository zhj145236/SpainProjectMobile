<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/user/info')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">datos personales</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/address/address')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">direccion de recepcion</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- <view class="list-cell" @click="navTo('实名认证')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">实名认证</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell b-b" @click="navTo('/pages/user/changepwd')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">modificar contrasena</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		
		<!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
		<view class="list-cell m-t b-b" @click="cleanCache" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">limpiar cache</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- <view class="list-cell b-b" @click="navTo('关于Dcloud')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于Dcloud</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell">
			<text class="cell-tit">buscar actualizaciones</text>
			<text class="cell-tip">version actual 2.1.1</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">salir</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				memberid: 0,
			};
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
		},
		methods: {
			...mapMutations(['logout']),
			
			navTo(url){
				if(!this.memberid){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				});
			},
			cleanCache(){
				this.$api.msg('eliminar correctamente');
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: 'estas seguro de salir del inicio',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
				    			uni.navigateBack();
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		font-family: $font-family;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
