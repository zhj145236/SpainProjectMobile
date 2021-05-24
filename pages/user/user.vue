<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.member_avatar || '/static/default_face.gif'"></image>
				</view>
				<view class="info-box">
					<text class="username">{{userInfo.member_name || 'visitante'}}</text>
				</view>
			</view>
			<view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<!-- <view class="b-btn">
					立即开通
				</view> -->
				<!-- <view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					DCloud会员
				</view> -->
				<text class="e-m"><!-- DCloud Union --></text>
				<text class="e-b"><!-- 开通会员开发无bug 一测就上线 --></text>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">{{memberInfo.available_predeposit || 0}}</text>
					<text>Saldo</text>
				</view>
				<view class="tj-item">
					<text class="num">{{memberInfo.voucher_count || 0}}</text>
					<text>bonos</text>
				</view>
				<view class="tj-item">
					<text class="num">{{memberInfo.member_points || 0}}</text>
					<text>puntos</text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="fui-cell-group fui-cell-click">
				<view class="fui-cell" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<view class="fui-cell-icon">
						<text class="yticon icon-shouye"></text>
					</view>
					<view class="fui-cell-text">todos los pedidos</view>
					<view class="fui-cell-remark"></view>
				</view>
				<view class="fui-icon-group col-5 nomargin">
					<view class="fui-icon-col" @click="navTo('/pages/order/order?state=1')"  hover-class="common-hover" :hover-stay-time="50">
						<view class="badge" v-if="orderInfo.order_nopay_count>0">{{orderInfo.order_nopay_count}}</view>
						<text class="yticon icon-daifukuan"></text>
						<view class="text">Impago</view>
					</view>
					<view class="fui-icon-col" @click="navTo('/pages/order/order?state=2')"  hover-class="common-hover" :hover-stay-time="50">
						<view class="badge" v-if="orderInfo.order_noship_count>0">{{orderInfo.order_noship_count}}</view>
						<view class="yticon icon-daifahuo" style="margin-bottom: 14upx;"><image src="/static/temp/icon-daifahuo.png" style="width: 40upx;height: 40upx;margin-top:7px;"></image></view>
						<view class="text">No entregado</view>
					</view>
					<view class="fui-icon-col" @click="navTo('/pages/order/order?state=3')"  hover-class="common-hover" :hover-stay-time="50">
						<view class="badge" v-if="orderInfo.order_noreceipt_count>0">{{orderInfo.order_noreceipt_count}}</view>
						<text class="yticon icon-yishouhuo"></text>
						<view class="text">Recepción</view>
					</view>
					<view class="fui-icon-col" @click="navTo('/pages/order/order?state=4')"  hover-class="common-hover" :hover-stay-time="50">
						<view class="badge" v-if="orderInfo.order_noeval_count>0">{{orderInfo.order_noeval_count}}</view>
						<text class="yticon icon-pingjia"></text>
						<view class="text">No evaluado</view>
					</view>
					<view class="fui-icon-col" @click="navTo('/pages/order/order?state=6')" hover-class="common-hover" :hover-stay-time="50">
						<view class="badge" v-if="orderInfo.order_refund_count>0">{{orderInfo.order_refund_count}}</view>
						<text class="yticon icon-shouhoutuikuan"></text>
						<view class="text">Post-venta</view>
					</view>
				</view>
			</view>
			
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>historial de navegacion</text>
				</view>
				<scroll-view scroll-x class="h-list" v-if="goodsList.length>0">
					<image v-for="(item,index) in goodsList" :key="index" @click="navTo('/pages/product/product?id='+item.goods_id)" :src="item.goods_image" mode="aspectFill"></image>
				</scroll-view>
				<!-- <list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="我的钱包" tips="您的会员还有3天过期"></list-cell> -->
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="Direccion de entrega" @eventClick="navTo('/pages/address/address')"></list-cell>
				<list-cell icon="icon-tuijian" iconColor="#ffaa00" title="Reciba cupones" @eventClick="navTo('/pages/coupon/coupon')"></list-cell>
				<!-- <list-cell icon="icon-share" iconColor="#9789f7" title="分享" tips="邀请好友赢10万大礼"></list-cell> -->
				<list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="Broncear Orden" @eventClick="navTo('/pages/baskorder/baskorder')"></list-cell>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="Mi colección" @eventClick="navTo('/pages/favorite/favorite')"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="configurar" border="" @eventClick="navTo('/pages/set/set')"></list-cell>
			</view>
		</view>
			
		
    </view>  
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
    import {  
        mapState 
    } from 'vuex';
	import {
	    mapMutations  
	} from 'vuex';
	import core from '@/utils/core';
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				memberid: 0,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				orderInfo: [],
				memberInfo: [],
				goodsList: [],
			}
		},
		onLoad(){
		},
		onShow(){
			this.loadData();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
        methods: {
			...mapMutations(['login']),
			async loadData() {
				let that = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.login(res.data);
				    }
				});
				if(that.userInfo.member_id){
					that.memberid = that.userInfo.member_id;
					core.get('AppMember/getMemberInfo',{memberid:that.memberid},function(data){
						uni.hideLoading();
						if(data.state == 0){
							uni.showModal({
								content: data.msg,
								showCancel: false
							})
							return
						}else{
							that.memberInfo = data.member_info;
							that.orderInfo = data.order_list;
							that.goodsList = data.goods_list;
						}
					});
				}else{
					that.memberid = 0;
					that.memberInfo = [];
					that.orderInfo = [];
					that.goodsList = [];
				}
			},

			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})  
			}, 
	
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
        }  
    }  
</script>  
<style lang='scss'>
	page {
		font-family: $font-family;
	}
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.user-section{
		height: 520upx;
		padding: 100upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}

	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;
			.yticon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.fui-cell-group {
		margin-top: 20upx;
		background-color: #fff;
		line-height: 1.4;
		font-size: 32upx;
		overflow: hidden;
		position: relative;
		.fui-cell {
		    position: relative;
		    padding: 24upx;
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: -ms-flexbox;
		    display: flex;
		    -webkit-box-align: center;
		    -ms-flex-align: center;
		    align-items: center;
		    transition-duration: 300ms;
		    transition-property: background-color;
			border-top-left-radius: 10upx;
			border-top-right-radius: 10upx;
			.fui-cell-icon {
			    margin-right: 16upx;
			    width: 32upx;
			    height: 32upx;
			    line-height: 32upx;
			    color: #fa436a;
			    text-align: center;
			}
			.fui-cell-text {
			    flex: 1;
			    font-size: 28upx;
			    color: #303133;
				line-height: 1;
			}
			.fui-cell-remark {
			    color: #999;
			    text-align: right;
			    font-size: 26upx;
			    margin-right: 8upx;
			}
			.fui-cell-remark:after {
			    content: " ";
			    display: inline-block;
			    transform: rotate(45deg);
			    height: 16upx;
			    width: 16upx;
			    border-width: 1px 1px 0 0;
			    border-color: #C8C8CD;
			    border-style: solid;
			    position: relative;
			    top: -1px;
			    margin-left: .3em;
			}
		}
		.fui-icon-group {
		    width: 100%;
		    position: relative;
		    overflow: hidden;
		    background: #fff;
			border-top: 1px solid #ebebeb;
			border-bottom-left-radius: 10upx;
			border-bottom-right-radius: 10upx;
			.fui-icon-col {
			    width: 25%;
			    height: auto;
				font-size: 24upx;
				color: #303133;
			    position: relative;
			    padding: 0;
			    margin: 30upx 0;
			    text-align: center;
			    transition: background-color 300ms;
			    float: left;
			    border: none!important;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-bottom: 20upx;
				.yticon {
				    font-size: 48upx;
				    margin-bottom: 18upx;
				    color: #fa436a;
				}
				.badge {
					position: absolute;
					top: -7px;
					left: 50%;
					text-align: center;
					z-index: 100;
				    background-color: #ff5555;
				    border-radius: 200upx;
				    color: #fff;
				    display: inline-block;
				    font-size: 24upx;
				    padding: 4upx 14upx;
					margin-left: 14upx;
					min-width: 32upx;
				}
				.text {
				    font-size: 24upx;
				    text-align: center;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				    padding: 8upx;
				    width: 100%;
				    box-sizing: border-box;
				}
			}
		}
		.fui-icon-group.nomargin {
		    margin-top: 0;
		}
		.fui-icon-group.col-5 .fui-icon-col {
		    width: 20%;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.yticon{
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
</style>