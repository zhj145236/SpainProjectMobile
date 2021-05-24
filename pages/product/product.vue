<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<view class="goods-title">
				<view class="name" style="width:88%;">
					<text class="title">{{goodsInfo.goods_name}}</text>
				</view>
				<view class="showshade">
					<text class="yticon icon-share" style="font-size:42upx;color: #fd5555;padding-left: 16upx;"></text>
					<view class="text">Reenvío</view>
				</view>
			</view>
			<view class="goods-subtitle" v-if="goodsInfo.goods_advword">
				<text class="text-danger" >{{goodsInfo.goods_advword}}</text>
			</view>
			<view class="price-box" v-if="goodsInfo.goods_ispifa==0">
				<text class="price-tip">¥</text>
				<text class="price" v-if="goodsInfo.goods_ispifa==0">{{goodsInfo.goods_price}}</text>
				<text class="m-price" v-if="goodsInfo.goods_ispifa==0">¥{{goodsInfo.goods_marketprice}}</text>
				<!-- <text class="coupon-tip">7折</text> -->
			</view>
			<view class="price-box" v-if="goodsInfo.goods_ispifa==1" style="height: 80upx;">
				<!-- <text class="price-tip">¥</text>
				<text class="price" v-if="goodsInfo.goods_ispifa==0">{{goodsInfo.goods_price}}</text>
				<text class="m-price" v-if="goodsInfo.goods_ispifa==0">¥{{goodsInfo.goods_marketprice}}</text>
				<text class="price" v-if="goodsInfo.goods_ispifa==1">{{goodsInfo.pifaprice1}}</text>
				<text class="m-price" v-if="goodsInfo.goods_ispifa==1" style="text-decoration: unset;">>={{goodsInfo.startnum1}}</text>
				<text class="m-price" v-if="goodsInfo.goods_ispifa==1" style="text-decoration: unset;">>={{goodsInfo.startnum2}}</text>
				<text class="m-price" v-if="goodsInfo.goods_ispifa==1" style="text-decoration: unset;">>={{goodsInfo.startnum3}}</text> -->
				<view v-if="goodsInfo.startnum1>0">
					<view class="price">¥{{goodsInfo.pifaprice1}}</view>
					<view class="m-price" style="text-decoration: unset;">{{goodsInfo.startnum1}}-{{goodsInfo.endnum1}} Pieza</view>
				</view>
				<view style="margin-left: 30upx;" v-if="goodsInfo.startnum2>0">
					<view class="price">¥{{goodsInfo.pifaprice2}}</view>
					<view class="m-price" style="text-decoration: unset;">{{goodsInfo.startnum2}}-{{goodsInfo.endnum2}} Pieza</view>
				</view>
				<view style="margin-left: 30upx;" v-if="goodsInfo.startnum3>0">
					<view class="price">¥{{goodsInfo.pifaprice3}}</view>
					<view class="m-price" style="text-decoration: unset;">{{goodsInfo.startnum3}}-{{goodsInfo.endnum3}} Pieza</view>
				</view>
			</view>
			
			<view class="bot-row">
				<text>Ventas: {{goodsInfo.goods_salenum}}</text>
				<text>Inventario: {{goodsInfo.goods_storage}}</text>
				<text>Navegar: {{goodsInfo.goods_click}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
			
		</view> -->
		
		<view class="c-list" style="margin-top:16upx;">
			<view class="c-row b-b" @click="toggleSpec('select')">
				<text class="tit">Cantidad</text>
				<view class="con" v-if="specSelected.length>0">
					seleccionado：
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<view class="con" v-else>
					<text class="selected-text">
						seleccionar especificaiones, cantidad
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<!-- <view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">servicio</text>
				<view class="bz-list con">
					<!-- <icon type="success" size="15" color="green" style="vertical-align:middle;"/>
					<text>7 dias para devoluvion</text>
					<icon type="success" size="15" color="green" style="vertical-align:middle;"/>
					<text>garantia de producto original</text> -->
					<icon type="success" size="15" color="green" style="vertical-align:middle;"/>
					<text style="padding-left: 8upx;">garantia de calidad</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header" v-if="evaluateList.all>0">
				<text class="tit">evaluación</text>
				<text>({{evaluateList.all}})</text>
				<text class="tip">tasa de comentario favorable {{evaluateList.good_percent}}%</text>
				<text class="yticon icon-you"></text>
			</view>
			 <view class="e-header" v-else>
			 	<text class="tit">evaluación</text>
			 	<text class="tip">no tiene comentario</text>
			 </view>
			<view class="eva-box" v-if="evaluateList.goodsevallist.length>0" v-for="(item,index) in evaluateList.goodsevallist" :key="index">
				<image class="portrait" :src="item.geval_frommemberavatar" mode="aspectFill"></image>
				<view class="right">
					<view class="name">
						{{item.geval_frommembername}}
						<view class="bot">
							<text class="time">{{item.geval_addtime}}</text>
						</view>
					</view>
					<view class="star">
						<image class="shine" src="/static/temp/star-on.png" v-if="item.geval_scores>=1"></image>
						<image class="shine" src="/static/temp/star-off.png" v-else></image>
						<image class="shine" src="/static/temp/star-on.png" v-if="item.geval_scores>=2"></image>
						<image class="shine" src="/static/temp/star-off.png" v-else></image>
						<image class="shine" src="/static/temp/star-on.png" v-if="item.geval_scores>=3"></image>
						<image class="shine" src="/static/temp/star-off.png" v-else></image>
						<image class="shine" src="/static/temp/star-on.png" v-if="item.geval_scores>=4"></image>
						<image class="shine" src="/static/temp/star-off.png" v-else></image>
						<image class="shine" src="/static/temp/star-on.png" v-if="item.geval_scores>=5"></image>
						<image class="shine" src="/static/temp/star-off.png" v-else></image>
					</view>
					<text class="con">{{item.geval_content}}</text>
					
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>foto/detalle</text>
			</view>
			<view class="wxParse">
				<view class="parse-con">
					<u-parse :content="desc"></u-parse>
				</view>
			</view>
		</view>
		
		<!-- 悬浮按钮 -->
		<view class="fui-flex-kefu" v-if="storeInfo.store_whatsappurl!=''" @click="kfbtn">
			<image class="icon-kefu" src="/static/icon-whatsapp.png"></image>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>Hogar</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<view class="badge" v-if="goodsInfo.goods_cartnum>0">{{goodsInfo.goods_cartnum}}</view>
				<text class="yticon icon-gouwuche"></text>
				<text>Carrito</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>Ocultar</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" @click="toggleSpec('addcart')" class=" action-btn no-border add-cart-btn">Añadir carrito</button>
				<button type="primary" @click="toggleSpec('buy')" class=" action-btn no-border buy-now-btn">comprar</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="imgList[0]"></image>
					<view class="right">
						<text class="price">¥{{goodsInfo.goods_price}}</text>
						<text class="stock">inventario：{{goodsInfo.goods_storage}}件</text>
						<view class="selected" v-if="specSelected.length>0">
							seleccionado：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
						<view class="selected" v-else>
							<text class="selected-text">
								favor seleccionar
							</text>
						</view>
					</view>
				</view>
				<scroll-view class="selectspec" scroll-y>
					<view v-for="(item,index) in specList" :key="index" class="attr-list">
						<text>{{item.name}}</text>
						<view class="item-list">
							<text 
								v-for="(childItem, childIndex) in specChildList" 
								v-if="childItem.pid === item.id"
								:key="childIndex" class="tit"
								:class="{selected: childItem.selected}"
								@click="selectSpec(childIndex, childItem.pid)"
							>
								{{childItem.name}}
							</text>
						</view>
					</view>
					<view class="attr-list">
						<view class="item-right">
							<text>cantidad</text>
							<uni-number-box 
								class="step"
								:min="0" 
								:max="goodsInfo.goods_storage"
								:value="total>goodsInfo.goods_storage?goodsInfo.goods_storage:total"
								:isMax="total>=goodsInfo.goods_storage?true:false"
								:isMin="total===0"
								:index="0"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
					</view>
				</scroll-view>
				
				<view class="footer-btn-group">
					<button class="btn" @click="confirm" style="margin:0;" v-if="btntype!='select'">confirmado</button>
					<button class="btn confirmbtn" @click="addcart" style="background: #fe9402;border-top-right-radius: 0;border-bottom-right-radius: 0;" v-if="btntype=='select'">agregar en carrito</button>
					<button class="btn confirmbtn" @click="buy" style="border-top-left-radius: 0;border-bottom-left-radius: 0;" v-if="btntype=='select'">comprar ahora</button>
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import core from '@/utils/core';
	import uParse from "@/components/feng-parse/parse.vue";
	import uniNumberBox from '@/components/uni-number-box.vue';
	export default{
		components: {
			share,
			uParse,
			uniNumberBox
		},
		data() {
			return {
				memberid: 0,
				goodsid: 0,
				total: 0,
				specClass: 'none',
				specSelected:[],
				goodsInfo: {},
				btntype: '',
				storeInfo: {},
				
				favorite: false,
				shareList: [],
				imgList: [],
				desc: '',
				specImage: [],
				mansongList: [],
				evaluateList: [],
				specList: [],
				specChildList: []
			};
		},
		async onLoad(options){
			let that = this; 
			let id = options.id;
			that.goodsid = id;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			core.get('AppGoods/getGoodsdetail',{goods_id:id, memberid:that.memberid},function(res){
				uni.hideLoading();
				// console.log('goods',res)
				if(res.state == 0){
					uni.showModal({
						content: res.msg,
						showCancel: false
					})
					return
				}else{
					that.imgList = res.goods_image;
					that.desc = res.goods_desc;
					that.goodsInfo = res.goods_info;
					that.storeInfo = res.store_info;
					that.specList = res.spec_list;
					that.specChildList = res.specchild_list;
					that.mansongList = res.mansong_info;
					that.evaluateList = res.goods_evaluate;
					if(res.goods_info){
						that.favorite = res.goods_info.goods_isfavorites;
					}
				}
			});
			
			// this.shareList = await this.$api.json('shareList');
		},
		methods:{
			//规格弹窗开关
			toggleSpec(data) {
				if(data != ''){
					this.btntype = data;
				}else{
					this.btntype = '';
				}
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid){
				let list = this.specChildList;
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false);
					}
				})
				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = []; 
				list.forEach(item=>{ 
					if(item.selected === true){ 
						this.specSelected.push(item); 
					} 
				})
				
			},
			//数量
			numberChange(data){
				let that = this;
				that.total = data.number;
				if(that.goodsInfo.goods_ispifa>0){
					if(that.goodsInfo.startnum1 <= that.total && that.total <= that.goodsInfo.endnum1){
						that.goodsInfo.goods_price = that.goodsInfo.pifaprice1;
					}else if(that.goodsInfo.startnum2 <= that.total && that.total <= that.goodsInfo.endnum2){
						that.goodsInfo.goods_price = that.goodsInfo.pifaprice2;
					}else if(that.goodsInfo.startnum3 <= that.total && that.total <= that.goodsInfo.endnum3){
						that.goodsInfo.goods_price = that.goodsInfo.pifaprice3;
					}
				}
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite(){
				let that = this;
				that.favorite = !that.favorite;
				core.get('AppFavorite/favoritesgoods',{memberid:that.memberid,goods_id:that.goodsid,isfavorite:that.favorite},function(res){
					uni.hideLoading();
				});
			},
			confirm(){
				if(this.btntype == 'addcart'){
					this.addcart();
				}
				if(this.btntype == 'buy'){
					this.buy();
				}
			},
			addcart(){
				if(!this.memberid){
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}else{
					let that = this;
					let option_name = '';
					if(that.specList.length>0 && that.specSelected.length<=0){
						that.$api.msg('favor seleccionar');
						return;
					}
					if(that.specSelected.length < that.specList.length){
						that.$api.msg('favor seleccionar');
						return;
					}
					if(that.total<=0){
						that.$api.msg('la cantidad debe ser mayor a 0');
						return;
					}
					if(that.specSelected.length>0){
						that.specSelected.forEach(item=>{
							if(item.selected === true){ 
								option_name += item.name + ' '; 
							} 
						})
					}
					let param = {
						memberid:that.memberid,
						goods_id:that.goodsid,
						total:that.total,
						option_name:option_name
					};
					core.get('AppCart/addCart',param,function(res){
						uni.hideLoading();
						if(res.state == 0){
							uni.showModal({
								content: res.msg,
								showCancel: false
							})
							return
						}else{
							that.$api.msg('agregado correctamente');
							that.goodsInfo.goods_cartnum = res.num;
							that.specClass = 'hide';
							setTimeout(() => {
								that.specClass = 'none';
							}, 250);
						}
					});
				}
			},
			buy(){
				if(!this.memberid){
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}else{
					let that = this;
					let goods = [];
					let option_name = '';
					if(that.specList.length>0 && that.specSelected.length<=0){
						that.$api.msg('favor seleccionar');
						return;
					}
					if(that.specSelected.length < that.specList.length){
						that.$api.msg('favor seleccionar');
						return;
					}
					if(that.specSelected.length>0){
						that.specSelected.forEach(item=>{
							if(item.selected === true){ 
								option_name += item.name + ' '; 
							} 
						})
					}
					if(that.total<=0){
						that.$api.msg('la cantidad debe ser mayor a 0');
						return;
					}
					goods.push({
						goods_id:that.goodsid,
						goods_num:that.total,
						option_name:option_name
					});
					that.specClass = 'hide';
					setTimeout(() => {
						that.specClass = 'none';
					}, 250);
					uni.navigateTo({
						url: `/pages/order/createOrder?fromcart=0&goods=${JSON.stringify(goods)}`
					})
				}
			},
			kfbtn(){
				let that = this;
				if(that.storeInfo.store_whatsappurl!=''){
					// #ifdef H5
					window.open(that.storeInfo.store_whatsappurl);
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.openURL(that.storeInfo.store_whatsappurl);
					// #endif
				}
			},
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
		font-family: $font-family;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.goods-title {
			display: flex;
			.title{
				font-size: 32upx;
				color: $font-color-dark;
				height: 50upx;
				line-height: 50upx;
			}
			.showshade {
				width: 60upx;
				.text {
					font-size: 20upx;
					color: #666;
					margin-top:10upx;
				}
			}
		}
		.goods-subtitle .text-danger {
		    font-size: 26upx;
		    padding: 20upx 0 8upx;
		    color: #ff5555;
		    line-height: 36upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
			font-weight: bold;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.shine {
				width: 32upx;
				height: 32upx;
			}
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				float: right;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		/* margin-top: 16upx; */
		padding: 20upx;;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 悬浮按钮 */
	.fui-flex-kefu {
		width: 108upx;
		position: fixed;
		overflow: hidden;
		z-index: 999;
		bottom: 150upx;
		right: 14upx;
		.icon-kefu {
			width: 108upx;
			height: 108upx;
			border-radius: 100%;
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			padding-bottom: 3px;
			border-bottom: 1px solid #f5f5f5;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.selectspec {
			height: 20vh;
			overflow-y: auto;
			.attr-list{
				display: flex;
				flex-direction: column;
				font-size: $font-base + 2upx;
				color: $font-color-base;
				padding-top: 30upx;
				padding-left: 10upx;
				.item-right {
					display: inline-block;
					.uni-numbox {
						position: unset;
						left: 0;
						bottom: 0;
						float: right;
					    display: -webkit-box;
					    display: -webkit-flex;
					    display: flex;
					    -webkit-box-pack: start;
					    -webkit-justify-content: flex-start;
					    justify-content: flex-start;
					    -webkit-box-align: center;
					    -webkit-align-items: center;
					    align-items: center;
					    width: 115px;
					    height: 35px;
					    background: #f5f5f5;
					}
				}
			}
			.item-list{
				padding: 20upx 0 0;
				display: flex;
				flex-wrap: wrap;
				text{
					display: flex;
					align-items: center;
					justify-content: center;
					background: #eee;
					margin-right: 20upx;
					margin-bottom: 20upx;
					border-radius: 100upx;
					min-width: 60upx;
					height: 60upx;
					padding: 0 20upx;
					font-size: $font-base;
					color: $font-color-dark;
				}
				.selected{
					background: #fbebee;
					color: $uni-color-primary;
				}
			}
		}
		.footer-btn-group {
			position: fixed;
			width: 92%;
			bottom: 0;
			height: 33px;
			background: #fff;
			-webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
			z-index: 999;
			.btn.confirmbtn {
				width: 50%;
				margin: 0;
				display: inline-block;
				border-radius: 5px;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
			.badge {
			    background: red none repeat scroll 0 0;
			    border-radius: 20upx;
			    color: white;
			    font-size: 24upx;
			    height: 32upx;
			    left: 23%;
			    line-height: 32upx;
			    margin-left: 4upx;
			    min-width: 32upx;
			    padding: 0 8upx;
			    position: absolute;
			    top: 4upx;
			    vertical-align: top;
			    z-index: 100;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
