<template>
	<view class="container">
		<view class="search-body">
			<view class="list current-search" v-if="remenList.length>0">
				<view class="list-header">
					<view>
						<image src="/static/temp/icon-hotsearch.png"></image>
						<text class="title">los mas buscados</text>
					</view>
				</view>
				<view class="nav-item">
					<text class="item" v-for="(item, index) in remenList" :key="index" @click="searchGoods({searchname: item.searchname})">{{item.searchname}}</text>
				</view>
			</view>
			<view class="list current-search" v-if="historyList.length>0">
				<view class="list-header">
					<view>
						<image src="/static/temp/search-history.png"></image>
						<text class="title">busqueda reciente</text>
					</view>
					<image src="/static/temp/icon-deletelog.png" @click="delsearchlog()"></image>
				</view>
				<view class="nav-item">
					<text class="item" v-for="(item, index) in historyList" :key="index" @click="searchGoods({searchname: item.searchname})">{{item.searchname}}</text>
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
				memberid: 0,
				remenList: [],
				historyList: [],
				searchname: ''
			};
		},
		onShow() {
			this.loadData();
		},
		methods: {
			async loadData() {
				let that = this;
				that.remenList = [];that.historyList = [];that.searchname = '';
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.memberid = res.data.member_id;
				    }
				});
				core.get('AppGoods/getSearchlog',{memberid:that.memberid},function(data){
					uni.hideLoading();
					that.remenList = data.remen_list;
					that.historyList = data.history_list;
				});
			},
			searchGoods(item) {
				this.searchname = item.searchname;
				core.get('AppGoods/addSearchlog',{memberid:this.memberid,searchname:this.searchname},function(data){
					uni.hideLoading();
				});
				uni.navigateTo({
					url: `/pages/product/list?searchname=`+this.searchname
				})
			},
			delsearchlog() {
				let that = this;
				uni.showModal({
				    title: 'notificacion',
				    content: 'estas seguro de eliminar historial de navegacion？',
				    success: function (res) {
				        if (res.confirm) {
				            core.get('AppGoods/delSearchlog',{memberid:that.memberid},function(data){
								if(data.state>0){
									that.historyList = [];
									uni.hideLoading();
								}
							});
				        }
				    }
				});
			}
		},
		onNavigationBarSearchInputChanged: function(e){
			this.searchname = e.text;
		},
		onNavigationBarSearchInputConfirmed: function(e){
			this.searchname = e.text;
			core.get('AppGoods/addSearchlog',{memberid:this.memberid,searchname:this.searchname},function(data){
				uni.hideLoading();
			});
			uni.navigateTo({
				url: `/pages/product/list?searchname=`+this.searchname
			})
		},
		onNavigationBarButtonTap(e) {
			let str = e.text;
			if(str == "cancelar"){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
		font-family: $font-family;
	}
	.search-body {
	    padding: 30upx;
	}
	.search-body .list {
	    margin-bottom: 66upx;
	}
	.search-body .list .list-header {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	    justify-content: space-between;
	    -ms-flex-line-pack: center;
	    align-content: center;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	}
	.search-body .list .list-header .title {
	    color: #333;
	    font-size: 28upx;
	    padding-left: 20upx;
	    -ms-flex-item-align: end;
	    align-self: flex-end;
	}
	.search-body .list .list-header image {
	    width: 32upx;
	    height: 32upx;
		vertical-align: middle;
	}
	.search-body .list .nav-item {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    padding-top: 26upx;
	    -ms-flex-wrap: wrap;
	    flex-wrap: wrap;
	}
	.search-body .list .nav-item .item {
	    padding: 16upx;
	    background-color: #fff;
	    color: #333;
	    font-size: 24upx;
	    margin-right: 20upx;
	    margin-bottom: 20upx;
	    cursor: pointer;
	    border-radius: 4upx;
	}
</style>
