<template>
	<view class="content">
		<view class="top-nav">
			<scroll-view class="navbar" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in navList" :key="index" 
						class="nav-item" 
						:class="{current: tabCurrentIndex === index}"
						@click="tabClick(index)"
					>
						{{item.text}}
					</view>
				</view>
			</scroll-view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time" @click="navToDetailPage(item)">numero de pedido：{{item.order_sn}}</text>
							<text class="state" @click="navToDetailPage(item)" :style="{color: item.stateTipColor}">{{item.state_desc}}</text>
							<text 
								v-if="item.order_state===0" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(item.order_id,index)"
							></text>
							<text class="yticon icon-you" style="margin-top: 3px;" v-else></text>
						</view>
						
						<!-- <scroll-view v-if="item.order_goods.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.order_goods" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="goodsItem.goods_image" mode="aspectFill"></image>
							</view>
						</scroll-view> -->
						<view 
							v-if="item.order_goods.length > 0" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.order_goods" :key="goodsIndex"
							 @click="navToDetailPage(item)"
						>
							<image class="goods-img" :src="goodsItem.goods_image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.goods_name}}</text>
								<text class="attr-box">{{goodsItem.option_name}}</text>
								<text class="price">{{goodsItem.goods_price}} x {{goodsItem.goods_num}}</text>
							</view>
						</view>
						
						<view class="price-box">
							Total
							<text class="num">{{item.order_goods.length}}</text>
							Pieza Productos monto a pagar
							<text class="price">{{item.order_amount}}</text>
						</view>
						<view class="action-box b-t" v-if="item.order_state != 0 ">
							<view class="action-btn" style="border: 1px solid rgba(0,0,0,.2);box-sizing: border-box;" v-if="item.order_state == 10">
								<picker @change="cancelOrder" :data-orderid="item.order_id" :range="cancelArr" :value="cancelindex">cancelar</picker>
							</view>
							<button class="action-btn" v-if="item.order_state == 20 && item.refund_state == 0" @click="refundOrder(item)">pedido en estado de reembolso</button>
							<button class="action-btn recom" v-if="item.order_state < 20" @click="payOrder(item)">pagar ahora</button>
							<button class="action-btn recom" v-if="item.order_state >= 30" @click="finishOrder(item)">confirma recibido</button>
							<button class="action-btn recom" v-if="item.order_state == 40 " @click="commentOrder(item)">opinar ahora</button>
						</view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	import core from '@/utils/core';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				memberid: 0,
				page: 1,//分页
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: 'todo',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: 'impago',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: 'no entregado',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: 'recepción',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: 'no evaluado',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 5,
						text: 'concluido',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 6,
						text: 'post-venta',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 7,
						text: 'cancelado',
						loadingType: 'more',
						orderList: []
					}
				],
				cancelArr: [ "cambiar otro producto", "Error de información, recompra", "no deseo comprar", "otras causas" ],
				cancelindex: 0
			};
		},
		
		onLoad(options){
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state || 0;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
		},
		 
		methods: {
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				let that = this;
				setTimeout(()=>{
					core.get('AppOrder/getOrderList',{memberid:that.memberid,state:state,page:that.page},function(res){
						uni.hideLoading();
						// console.log('aaaa',res)
						let ret = {
							page: res.page,
							pagesize: res.pagesize
						};
						let resList = res.order_list;
						if(resList.length>0){
							that.page = ret.page+1;
						}
						let orderList = resList.filter(item=>{
							//添加不同状态下订单的表现形式
							// item = Object.assign(item, {item.state_desc,item.stateTipColor});
							//演示数据所以自己进行状态筛选
							if(state === 0){
								//0为全部订单
								return item;
							}
							return state
						});
						orderList.forEach(item=>{
							navItem.orderList.push(item);
						})
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						that.$set(navItem, 'loaded', resList.length > 0 ? true : false);
						
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = orderList.length >= ret.pagesize ? 'more' : 'nomore';
					});
				}, 600);	
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.page = 1;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
				this.page = 1;
			},
			//删除订单
			deleteOrder(id,index){
				let that = this;
				uni.showModal({
					content: 'esta seguro de eliminar este pedido？',
					success: (e)=>{
						if(e.confirm){
							core.get('AppOrder/deleteOrder',{memberid:that.memberid,order_id:id},function(res){
								uni.hideLoading();
								if(res.state>0){
									that.navList[that.tabCurrentIndex].orderList.splice(index, 1);
								}
							});
						}
					}
				});
			},
			//取消订单
			cancelOrder(e){
				let that = this;
				that.cancelindex = e.target.value;
				let order_id = e.target.dataset.orderid;
				let remark = that.cancelArr[that.cancelindex];
				if(remark == ''){
					that.$api.msg('por favor elija la causa por la cual cancela el pedido');
					return;
				}
				core.get('AppOrder/cancelOrder',{memberid:that.memberid,order_id:order_id,remark:remark},function(res){
					uni.hideLoading();
					if(res.state>0){
						that.page = 1;
						that.loadData();
					}
				});
			},
			//申请退款
			refundOrder(item){
				let that = this;
				uni.navigateTo({
					url: `/pages/money/refund?orderinfo=${JSON.stringify(item)}`
				})
			},
			//立即支付
			payOrder(item){
				let that = this;
				uni.navigateTo({
					url: `/pages/money/pay?orderinfo=${JSON.stringify(item)}`
				})
			},
			//确认收货
			finishOrder(item){
				let that = this;
				uni.showModal({
					content: 'estas seguro de haber recibido el pedido completo？',
					success: (e)=>{
						if(e.confirm){
							core.get('AppOrder/finishOrder',{memberid:that.memberid,order_id:item.order_id},function(res){
								uni.hideLoading();
								if(res.state>0){
									that.page = 1;
									that.loadData();
								}
							});
						}
					}
				});
			},
			//立即评价
			commentOrder(item){
				uni.navigateTo({
					url: `/pages/order/comment?orderinfo=${JSON.stringify(item)}`
				})
			},
			//详情
			navToDetailPage(item){
				uni.navigateTo({
					url: `/pages/order/detail?id=`+item.order_id+'&pay_sn='+item.pay_sn
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		font-family: $font-family;
	}
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.top-nav {
		width: 100%;
		overflow: hidden;
		.navbar{
			height: 40px;
			padding: 0 5px;
			background: #fff;
			box-shadow: 0 1px 5px rgba(0,0,0,.06);
			position: relative;
			z-index: 10;
			white-space: nowrap;
			.scoll-wrapper {
				display:flex;
				align-items: flex-start;
				.nav-item{
					height: 100%;
					font-size: 15px;
					color: $font-color-dark;
					position: relative;
					padding: 18upx;
					&.current{
						color: $base-color;
						&:after{
							content: '';
							position: absolute;
							left: 50%;
							bottom: 0;
							transform: translateX(-50%);
							width: 44px;
							height: 0;
							border-bottom: 2px solid $base-color;
						}
					}
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
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
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
