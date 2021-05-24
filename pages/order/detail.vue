<template>
	<view class="content" v-if="orderInfo">
		
		<view class="order-detail-header">
			<view class="order-detail-ststus">
				<view style="font-size: 34upx;">{{orderInfo.state_desc}}</view>
				<view>monto del pedido：￥{{orderInfo.order_amount}}</view>
			</view>
		</view>
		<view class="address-section">
			<view class="order-addr">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen" >
					<view class="top">
						<text class="name">{{addressInfo.reciver_name}}</text>
						<text class="mobile">{{reciverInfo.mob_phone}}</text>
					</view>
					<text class="address">{{reciverInfo.address}}</text>
				</view>
			</view>
		</view>
		<view class="goods-section" >
			<view class="g-header b-b">
				<image class="logo" src="/static/default_store_avatar.png"></image>
				<text class="name">{{orderInfo.store_name}}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-if="orderInfo.extend_order_goods.length>0" v-for="(item,index) in orderInfo.extend_order_goods" :key="index" @click="navToDetailPage(item.goods_id)">
				<image :src="item.goods_image"></image>
				<view class="right">
					<text class="title clamp">{{item.goods_name}}</text>
					<text class="spec" v-if="item.option_name">Especificaciones：{{item.option_name}}</text>
					<view class="price-box">
						<text class="price">￥{{item.goods_price}}</text>
						<text class="number">x {{item.goods_num}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">Subtotal de productos básicos</text>
				<text class="cell-tip">￥{{orderInfo.goods_amount}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red" >￥-1.00</text>
			</view> -->
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">valor del envio</text>
				<text class="cell-tip">￥{{orderInfo.shipping_fee}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">monto a pagar</text>
				<text class="cell-tip red" style="font-size: 30upx;">￥{{orderInfo.order_amount}}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">observaciones</text>
				<view class="desc">{{addressInfo.order_message}}</view>
			</view>
		</view>
		
		<view class="order-info">
			<view class="yt-list-info">
				<text class="cell-tit">numero de pedido</text>
				<text class="cell-tip">{{orderInfo.order_sn}}</text>
			</view>
			<view class="yt-list-info">
				<text class="cell-tit">tiempo de creacion</text>
				<text class="cell-tip">{{orderInfo.create_time}}</text>
			</view>
			<!-- <view class="yt-list-info">
				<text class="cell-tit">tiempo de pago</text>
				<text class="cell-tip">{{orderInfo.pay_time}}</text>
			</view>
			<view class="yt-list-info">
				<text class="cell-tit">tiempo de finalizar</text>
				<text class="cell-tip">{{orderInfo.success_time}}</text>
			</view> -->
		</view>
		
		<!-- 底部 -->
		<view class="footer" v-if="orderInfo.order_state != 0 && orderInfo.evaluation_state == 0">
			<view class="action-btn" style="position: relative;top: -10px;border: 1px solid rgba(0,0,0,.2);box-sizing: border-box;" v-if="orderInfo.order_state == 10">
				<picker @change="cancelOrder" :range="cancelArr" :value="cancelindex">cancelar</picker>
			</view>
			<button class="action-btn" v-if="orderInfo.order_state == 20 && orderInfo.refund_state == 0" @click="refundOrder">pedido en estado de reembolso</button>
			<button class="action-btn recom" v-if="orderInfo.order_state < 20" @click="payOrder">pagar ahora</button>
			<button class="action-btn recom" v-if="orderInfo.order_state >= 30" @click="finishOrder">confirma recibido</button>
			<button class="action-btn recom" v-if="orderInfo.order_state == 40 && orderInfo.evaluation_state == 0" @click="commentOrder">opinar ahora</button>
		</view>
		
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				memberid: 0,
				pay_sn: '',
				order_id: 0,
				orderInfo: {},
				addressInfo: {},
				reciverInfo: {},
				cancelArr: [ "cambiar otro producto", "Error de información, recompra", "no deseo comprar", "otras causas" ],
				cancelindex: 0
			}
		},
		onLoad(option){
			let that = this;
			that.pay_sn = option.pay_sn;
			that.order_id = option.id || 0;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			if(!that.memberid){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
			that.loadData();
		},
		methods: {
			loadData(){
				let that = this;
				core.get('AppOrder/getOrderDetail',{memberid:that.memberid,order_id:that.order_id,pay_sn:that.pay_sn},function(res){
					uni.hideLoading();
					// console.log('aaaa',res)
					if(res.state == 0){
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
						return
					}else{
						that.orderInfo = res.order_info;
						that.addressInfo = res.order_info.extend_order_common;
						if(that.addressInfo.reciver_info){
							that.reciverInfo = that.addressInfo.reciver_info;
						}
					}
				});
			},
			//删除订单
			deleteOrder(id,index){
				let that = this;
				uni.showModal({
					content: 'esta seguro de eliminar este pedido？',
					success: (e)=>{
						if(e.confirm){
							console.log('deleteOrder', id);
							// core.get('AppOrder/deleteOrder',{memberid:that.memberid,order_id:id},function(res){
							// 	uni.hideLoading();
							// 	if(res.state>0){
							// 		that.navList[that.tabCurrentIndex].orderList.splice(index, 1);
							// 	}
							// });
						}
					}
				});
			},
			//取消订单
			cancelOrder(e){
				let that = this;
				that.cancelindex = e.target.value;
				let order_id = that.orderInfo.order_id;
				let remark = that.cancelArr[that.cancelindex];
				if(remark == ''){
					that.$api.msg('por favor elija la causa por la cual cancela el pedido');
					return;
				}
				core.get('AppOrder/cancelOrder',{memberid:that.memberid,order_id:order_id,remark:remark},function(res){
					uni.hideLoading();
					if(res.state>0){
						that.orderInfo = {};
						that.addressInfo = {};
						that.reciverInfo = {};
						that.loadData();
					}
				});
			},
			//申请退款
			refundOrder(){
				let that = this;
				uni.navigateTo({
					url: `/pages/money/refund?orderinfo=${JSON.stringify(that.orderInfo)}`
				})
			},
			//立即支付
			payOrder(){
				let that = this;
				uni.navigateTo({
					url: `/pages/money/pay?orderinfo=${JSON.stringify(that.orderInfo)}`
				})
			},
			//确认收货
			finishOrder(){
				let that = this;
				let order_id = that.orderInfo.order_id;
				uni.showModal({
					content: 'estas seguro de haber recibido el pedido completo？',
					success: (e)=>{
						if(e.confirm){
							core.get('AppOrder/finishOrder',{memberid:that.memberid,order_id:order_id},function(res){
								uni.hideLoading();
								if(res.state>0){
									that.orderInfo = {};
									that.addressInfo = {};
									that.reciverInfo = {};
									that.loadData();
								}
							});
						}
					}
				});
			},
			//立即评价
			commentOrder(){
				let that = this;
				uni.navigateTo({
					url: `/pages/order/comment?orderinfo=${JSON.stringify(that.orderInfo)}`
				})
			},
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=`+id
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		font-family: $font-family;
		padding-bottom: 180upx;
		background: $page-color-base;
	}
	.order-detail-header{
		width: 100%;
		height: 160upx;
		display: flex;
		color: #fff;
		.order-detail-ststus{
			background: linear-gradient(to right, #ffb43e 0%,#fd9526 100%);
			flex: 1;
			-webkit-box-flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			-webkit-align-items: center;
			justify-content: center;
			padding: 0 24upx;
			font-size: 26upx;
			line-height: 48upx;
		}
	}
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		margin-top: 16upx;
		.order-addr {
			display: flex;
			align-items: center;
		}
		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}
		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}
		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}
		.mobile {
			font-size: 34upx;
		}
		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}
	}
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;
	
		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}
	
		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}
	
		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}
	
		.g-item {
			display: flex;
			margin: 20upx 30upx;
	
			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}
	
			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}
	
			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}
	
			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}
	
			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;
	
				.price {
					margin-bottom: 4upx;
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}
	
			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	
	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;
	
		&.cell-hover {
			background: #fafafa;
		}
	
		&.b-b:after {
			left: 30upx;
		}
	
		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;
	
			&.hb {
				background: #ffaa0e;
			}
	
			&.lpk {
				background: #3ab54a;
			}
	
		}
	
		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}
	
		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}
	
		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
	
			&.disabled {
				color: $font-color-light;
			}
	
			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}
	
		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}
	
		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 1.5;
		}
		
	}
	.order-info{
		margin-top: 16upx;
		background-color: #fff;
		line-height: 1.4;
		font-size: 26upx;
		overflow: hidden;
		position: relative;
		display: block;
		padding: 14upx 0;
		.yt-list-info{
			position: relative;
			padding: 8upx 24upx;
			display: flex;
			-webkit-box-align: center;
			align-items: center;
			transition-duration: 300ms;
			transition-property: background-color;
			line-height: 1.2;
			.cell-tit {
				width: 120upx;
				font-size: 26upx;
				color: $font-color-light;
				margin-right: 28upx;
			}
			.cell-tip {
				font-size: 26upx;
				color: $font-color-light;
			}
		}
	}
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		width: 100%;
		height: 90upx;
		font-size: 30upx;
		background-color: #fff;
		color: $font-color-base;
		padding-right: 24upx;
		text-align: right;
		line-height: 4.4;
		box-shadow: 0 0 4px rgba(0,0,0,0.1);
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			display: inline-block;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
</style>
