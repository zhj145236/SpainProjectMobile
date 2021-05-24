<template>
	<view>
		<scroll-view
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
		
			<!-- 空白页 -->
			<empty v-if="noticeList.length === 0"></empty>
			
			<view class="notice-item" v-if="noticeList.length>0" v-for="(item,index) in noticeList" :key="index" @click="navToDetailPage(item.article_id)">
				<text class="time">{{item.create_time}}</text>
				<view class="content">
					<text class="title">{{item.article_title}}</text>
					<view class="img-wrapper">
						<image class="pic" :src="item.article_pic" v-if="item.article_pic!=''"></image>
						<image class="pic" src="/static/temp/ad2.jpg" v-else></image>
						<!-- <view class="cover">活动结束</view> -->
					</view>
					<!-- <text class="introduce">介绍</text> -->
					<view class="bot b-t">
						<text>ver detalles</text>
						<text class="more-icon yticon icon-you"></text>
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
				noticeList:[],
				page: 1,//分页
				loadingType: '',
			}
		},
		onLoad(){
			this.loadData();
		},
		methods: {
			loadData(){
				let that = this;
				core.get('AppNotice/getNoticeList',{page: that.page},function(res){
					uni.hideLoading();
					let ret = {
						page: res.page,
						pagesize: res.pagesize
					};
					let noticeList = res.notice_list;
					if(noticeList.length>0){
						that.page = ret.page+1;
					}
					that.noticeList = that.noticeList.concat(noticeList);
					that.loadingType = noticeList.length >= ret.pagesize ? 'more' : 'nomore';
				});
			},
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/notice/detail?id=${id}`
				})
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
		font-family: $font-family;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
