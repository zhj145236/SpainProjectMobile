<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen" v-if="addressData">
					<view class="top">
						<text class="name">{{addressData.address_realname}}</text>
						<text class="mobile">{{addressData.address_mob_phone}}</text>
					</view>
					<text class="address">{{addressData.address_detail}}</text>
				</view>
				<view class="cen" v-else>
					<view class="top">
						<text class="name">agresar direccion de recepcion</text>
					</view>
				</view>
				<text class="yticon icon-you"></text>
			</view>

			<image class="a-bg" :src="addressbg"></image>
		</navigator>

		<view class="goods-section" v-if="storeGoodsList.length>0" v-for="(item,index) in storeGoodsList" :key="index">
			<view class="g-header b-b">
				<image class="logo" src="/static/default_store_avatar.png"></image>
				<text class="name">{{item.store_name}}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(gitem,gidx) in item.goods_list" :key="gidx">
				<image :src="gitem.goods_image_url"></image>
				<view class="right">
					<text class="title clamp">{{gitem.goods_name}}</text>
					<text class="spec" v-if="gitem.option_name">Especificaciones：{{gitem.option_name}}</text>
					<view class="price-box">
						<text class="price">￥{{gitem.goods_price}}</text>
						<text class="number">x {{gitem.goods_num}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view>
		</view> -->
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">precio del producto</text>
				<text class="cell-tip">￥{{goodsTotalPrice}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">precio con descuento</text>
				<text class="cell-tip red" v-if="goodsDiscountPrice>0">￥-{{goodsDiscountPrice}}</text>
				<text class="cell-tip " v-else>￥0.00</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">valor del envio</text>
				<text class="cell-tip">￥{{freighttotal}}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">observaciones</text>
				<input class="desc" type="text" v-model="remark" placeholder="favor ingresar sus observaciones" placeholder-class="placeholder" />
			</view>
		</view>
		
		<!-- 支付方式 -->
		<view class="pay-list">
			<view class="pay-item" v-if="paymentList.length>0" v-for="(item,index) in paymentList" :key="index" @click="changePayType(item.payment_code,item.payment_desc)">
				<view class="pay-item-nav">
					<view class="fui-list-media">
						<image class="icon-yuezhifu" src="/static/temp/ye.png" v-if="item.payment_code=='predeposit'"></image>
						<image class="icon-yuezhifu" src="/static/temp/yinhangka.png" v-if="item.payment_code=='bankpay'"></image>
						<image class="icon-yuezhifu" src="/static/temp/wx.png" v-if="item.payment_code=='wxpay'"></image>
						<image class="icon-yuezhifu" src="/static/temp/zfb.png" v-if="item.payment_code=='zfbpay'"></image>
					</view>
					<view class="fui-list-inner">
						<view class="tit">{{item.payment_name}}</view>
						<view class="subtitle" v-if="item.payment_code=='predeposit'">
							monto disponible：
							<text class="text-danger">¥<text>{{predeposit}}</text></text>
						</view>
						<view class="subtitle" v-if="item.payment_code=='bankpay'">
							Cuenta de cobro：{{item.payment_desc}}
						</view>
					</view>
				</view>
				<view class="yticon icon-xuanzhong2" v-if="payType==item.payment_code && skbanksn == item.payment_desc"></view>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>monto a pagar</text>
				<text class="price-tip">￥</text>
				<text class="price">{{allTotalPrice}}</text>
			</view>
			<text class="submit" @click="submit">enviar pedido</text>
		</view>
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">fecha vigente hasta2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>
						
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				addressbg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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',
				memberid: 0,
				fromcart: 0,
				goods: [],
				storeGoodsList: [],
				goodsTotalPrice: 0,
				goodsDiscountPrice: 0,
				allTotalPrice: 0,
				freighttotal: 0,//运费
				predeposit: 0,//用户余额
				maskState: 0, //优惠券面板显示状态
				remark: '', //备注
				payType: 'bankpay', //predeposit余额支付 bankpay银行汇款/转账 wxpay微信 zfbpay支付宝
				skbanksn: '',//收款账户
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: {},
				paymentList: []
			}
		},
		onLoad(option){
			//商品数据
			let that = this;
			let fromcart = option.fromcart;
			let goods = JSON.parse(option.goods);
			that.goods = goods;
			that.fromcart = fromcart;
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
			let param = {
				memberid: that.memberid,
				fromcart: fromcart,
				goods_id: that.goods[0].goods_id,
				goods_num: that.goods[0].goods_num,
				option_name: that.goods[0].option_name,
				goods: that.goods
			};
			core.get('AppOrder/create',param,function(res){
				uni.hideLoading();
				// console.log('create',res);
				if(res.state == 0){
					uni.showModal({
						content: res.msg,
						showCancel: false
					})
					return
				}else if(res.list){
					that.addressData = res.list.address_info;
					that.storeGoodsList = res.list.new_store_goods_list;
					that.paymentList = res.list.payment_list;
					that.goodsTotalPrice = res.list.goods_totalprice;
					that.goodsDiscountPrice = res.list.goods_discount_totalprice;
					that.allTotalPrice = res.list.all_totalprice;
					that.predeposit = res.list.available_predeposit;
					that.freighttotal = res.list.all_freighttotal;
				}
			});
			
		},
		methods: {
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			changePayType(type,code){
				this.payType = type;
				this.skbanksn = code;
			},
			submit(){
				let that = this;
				if(!that.addressData){
					that.$api.msg('favor agresar direccion de recepcion');
					return;
				}
				if(that.payType=='predeposit' && that.predeposit*1<that.allTotalPrice*1){
					that.$api.msg('saldo no disponible, favor seleccionar otro metodo de pago');
					return;
				}
				let submitparam = {
					memberid: that.memberid,
					paytype: that.payType,
					skbanksn: that.skbanksn,
					address_id: that.addressData.address_id,
					fromcart: that.fromcart,
					goods_id: that.goods[0].goods_id,
					goods_num: that.goods[0].goods_num,
					option_name: that.goods[0].option_name,
					remark: that.remark
				};
				core.get('AppOrder/submit',submitparam,function(res){
					uni.hideLoading();
					// console.log('orderres',res);
					if(res.state == 0){
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
						return
					}else{
						uni.redirectTo({
							url: '/pages/order/detail?pay_sn='+res.pay_sn
						})
					}
				});
				
			},
			stopPrevent(){}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
		font-family: $font-family;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
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

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
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
		}
		
	}
	
	/* 支付列表 */
	.pay-list{
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			width: 95%;
			margin: auto;
			display: flex;
			align-items: center;
			line-height: 1;
			height: 110upx;	
			position: relative;
			border-bottom: 1px solid #ebebeb;
			.pay-item-nav{
				width: 95%;
				display: flex;
				align-items: center;
				line-height: 1;
				.fui-list-media {
					margin-right: 20upx;
					width: 80upx;
					height: 68upx;
					position: relative;
					.icon-yuezhifu{
						width: 60upx;
						height: 60upx;
						font-size: 40upx;
					}
					.icon-weixinzhifu{
						width: 80upx;
						height: 80upx;
						font-size: 40upx;
						color: #6BCC03;
					}
					.icon-alipay{
						width: 80upx;
						height: 80upx;
						font-size: 40upx;
						color: #06B4FD;
					}
				}
				.fui-list-media:after {
					content: "";
					display: inline-block;
					position: absolute;
					width: 1upx;
					top: 4upx;
					bottom: 4upx;
					right: 0;
					border-right: 1upx solid #ebebeb;
					color: #ebebeb;
					transform-origin: 0 0;
				}
				.fui-list-inner {
					display: -webkit-box;
					display: -webkit-flex;
					display: -ms-flexbox;
					display: flex;
					height: 100%;
					-webkit-box-orient: vertical;
					flex-direction: column;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					justify-content: space-around;
					.tit{
						font-size: 32upx;
						color: $font-color-dark;
						flex: 1;
					}
					.subtitle {
						color: #999;
						font-size: 26upx;
					}
				}
			}
			.icon-xuanzhong2{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 60upx;
				height: 60upx;
				font-size: 40upx;
				color: $base-color;
			}
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}

</style>
