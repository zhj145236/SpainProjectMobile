<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.address_is_default" class="tag">predeterminar</text>
					<text class="address">{{item.address_detail}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.address_realname}}</text>
					<text class="mobile">{{item.address_mob_phone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		</view>
		<!-- <text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：添加和修改地址回调仅增加了一条数据做演示，实际开发中将回调改为请求后端接口刷新一下列表即可
		</text> -->
		
		<button class="add-btn" @click="addAddress('add')">Nueva dirección</button>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				source: 0,
				memberid: 0,
				addressList: []
			}
		},
		onLoad(option){
			this.source = option.source;
			this.loadData();
		},
		methods: {
			async loadData() {
				let that = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.memberid = res.data.member_id;
				    }
				});
				if(that.memberid){
					core.get('AppAddress/getAddressList',{memberid:that.memberid},function(data){
						uni.hideLoading();
						if(data.state == 0){
							uni.showModal({
								content: data.msg,
								showCancel: false
							})
							return
						}else{
							that.addressList = data.address_list;
						}
					});
				}
				
			},
			//订单页选择地址
			checkAddress(item){
				if(this.source == 1){
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
		font-family: $font-family;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
