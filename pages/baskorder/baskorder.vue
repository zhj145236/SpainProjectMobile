<template>
	<view class="content">
		<scroll-view
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
		
			<!-- 空白页 -->
			<empty v-if="pingjiaList.length === 0"></empty>
		
			<view class="order-item" v-if="pingjiaList.length>0" v-for="(item,index) in pingjiaList" :key="index">
				<view class="i-top b-b">
					<text class="time" >{{item.create_addtime}}</text>
				</view>
				<view class="goods-box-single">
					<image class="goods-img" :src="item.geval_goodsimage" mode="aspectFill"></image>
					<view class="right">
						<text class="title clamp">{{item.geval_goodsname}}</text>
						<view class="star" style="line-height: 2;">
							<text class="attr-box">Evaluacióndel producto：</text>
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
						<text class="attr-box">Mi evaluación：{{item.geval_content}}</text>
					</view>
				</view>
				<view class="action-box b-t" v-if="item.geval_imagearr.length==0">
					<button class="action-btn recom" @click="navToDetailPage(item)">Hoja de bronceado</button>
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
				pingjiaList: [],
				loadingType: '',
			};
		},
		onLoad(){
			this.loadData();
		},
		methods: {
			loadData(){
				let that = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.memberid = res.data.member_id;
				    }
				});
				let param = {
					page: that.page,
					memberid: that.memberid
				};
				core.get('AppBaskorder/getBaskorderList',param,function(res){
					uni.hideLoading();
					console.log('res',res)
					let ret = {
						page: res.page,
						pagesize: res.pagesize
					};
					let pingjiaList = res.pingjia_list;
					if(pingjiaList.length>0){
						that.page = ret.page+1;
					}
					that.pingjiaList = that.pingjiaList.concat(pingjiaList);
					that.loadingType = pingjiaList.length >= ret.pagesize ? 'more' : 'nomore';
				});
			},
			//对商品进行晒单
			navToDetailPage(item){
				uni.navigateTo({
					url: `/pages/baskorder/submit?goods=${JSON.stringify(item)}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		font-family: $font-family;
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
				.shine{
					width: 32upx;
					height: 32upx;
					vertical-align: middle;
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
</style>
