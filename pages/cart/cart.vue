<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				Vacío y vacío
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">Simplementepasee></navigator>
			</view>
			<view v-else class="empty-tips">
				Vacío y vacío
				<view class="navigator" @click="navToLogin">Para iniciarsesión></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.cart_id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.goods_image" 
								:class="item.loaded"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.goods_selected}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goods_name}}</text>
							<text class="attr">Especificaciones：{{item.option_name}}</text>
							<text class="price">¥{{item.goods_price}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.goods_stock"
								:value="item.goods_num>item.goods_stock?item.goods_stock:item.goods_num"
								:isMax="item.goods_num>=item.goods_stock?true:false"
								:isMin="item.goods_num===1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						vaciar
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{totalprice}}</text>
					<text class="coupon">
						<text>{{total}}</text>
						Piezas
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">Liquidación</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
	    mapMutations  
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import core from '@/utils/core';
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				memberid: 0,
				totalprice: 0, //总价格
				total: 0, //总数量
				allChecked: false, //全选状态  true|false
				empty: true, //空白页现实  true|false
				cartList: [],
			};
		},
		onShow(){
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			...mapMutations(['login']),
			//请求数据
			async loadData(){
				let that = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.login(res.data);
						that.memberid = res.data.member_id;
				    }
				});
				that.calcTotal();  //计算总价
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				let that = this;
				let param = {memberid:that.memberid};
				if(type === 'item'){
					param.cart_id = that.cartList[index].cart_id;
					param.goods_selected = !that.cartList[index].goods_selected;
				}else{
					const checked = !that.allChecked
					const list = that.cartList;
					list.forEach(item=>{
						item.goods_selected = checked;
					})
					that.allChecked = checked;
					param.cart_id = 0;
					param.goods_allselected = checked;
				}
				core.get('AppCart/selectCart',param,function(res){
					that.calcTotal(type);
				});
				
			},
			//数量
			numberChange(data){
				let that = this;
				core.get('AppCart/updateCart',{memberid:that.memberid,cart_id:that.cartList[data.index].cart_id,goods_num:data.number},function(res){
					that.calcTotal();
				});
			},
			//删除
			deleteCartItem(index){
				let that = this;
				core.get('AppCart/deleteCart',{memberid:that.memberid,cart_id:that.cartList[index].cart_id},function(res){
					if(res.state>0){
						that.cartList.splice(index, 1);
					}
					that.calcTotal();
				});
			},
			//清空
			clearCart(){
				let that = this;
				uni.showModal({
					content: 'Estáseguro de quedeseavaciar el carrito de la compra?',
					success: (e)=>{
						if(e.confirm){
							core.get('AppCart/deleteCart',{memberid:that.memberid,cart_id:0},function(res){
								if(res.state>0){
									that.allChecked = false;
									that.totalprice = 0;
									that.total = 0;
									that.cartList = [];
									that.empty = true;
									return;
								}
							});
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let that = this;
				let list = [];
				let totalprice = 0;
				let total = 0;
				let checked = true;
				core.get('AppCart/getCartList',{memberid:that.memberid},function(data){
					uni.hideLoading();
					if(data.cart_list.cart_goods_num > 0){
						that.empty = false;
						that.totalprice = data.cart_list.cart_all_price;
						that.total = data.cart_list.cart_goods_num;
						list = data.cart_list.list;
						list.forEach(item=>{
							item.loaded = 'loaded';
							if(item.goods_selected){
								totalprice += item.goods_price * item.goods_num;
								total++;
								checked = true;
							}else{
								checked = false;
							}
						})
						that.allChecked = checked;
						that.totalprice = Number(totalprice.toFixed(2));
						that.total = total;
						that.cartList = list;
					}else{
						that.empty = true;
						return;
					}
				});
			},
			//创建订单
			createOrder(){
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item=>{
					if(item.goods_selected){
						goodsData.push({
							cart_id: item.cart_id,
							goods_id: item.goods_id,
							goods_num: item.goods_num,
							option_name: item.option_name
						})
					}
				})
				uni.navigateTo({
					url: `/pages/order/createOrder?fromcart=1&goods=${JSON.stringify(goodsData)}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		font-family: $font-family;
	}
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
