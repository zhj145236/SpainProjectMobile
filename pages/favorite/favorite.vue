<template>
	<view class="content">
		<scroll-view
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
		
			<!-- 空白页 -->
			<empty v-if="goodsList.length === 0"></empty>
		
			<view class="goods-section" v-if="goodsList.length>0">
				<view class="g-header b-b">
					<image class="logo" src="/static/default_store_avatar.png"></image>
					<text class="name">{{goodsList[0].store_name}}</text>
				</view>
				<!-- 商品列表 -->
				<view class="g-item" v-for="(item,index) in goodsList" :key="index" @click="navToDetailPage(item.fav_id)">
					<image :src="item.goods_image"></image>
					<view class="right">
						<text class="title clamp">{{item.goods_name}}</text>
						<view class="price-box">
							<text class="price">￥{{item.favlog_price}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<uni-load-more :status="loadingType"></uni-load-more>
			
		</scroll-view>
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
				goodsList: [],
				loadingType: '',
			}
		},
		onLoad(){
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			that.loadData();
		},
		methods: {
			loadData(){
				let that = this;
				let param = {
					page: that.page,
					memberid: that.memberid
				};
				core.get('AppMember/getFavoriteList',param,function(res){
					uni.hideLoading();
					let ret = {
						page: res.page,
						pagesize: res.pagesize
					};
					let goodsList = res.goods_list;
					if(goodsList.length>0){
						that.page = ret.page+1;
					}
					that.goodsList = that.goodsList.concat(goodsList);
					that.loadingType = goodsList.length >= ret.pagesize ? 'more' : 'nomore';
				});
			},
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		font-family: $font-family;
	}
	page, .content{
		background: $page-color-base;
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
</style>
