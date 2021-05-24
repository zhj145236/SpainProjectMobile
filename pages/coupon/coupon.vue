<template>
	<view class="content">
		<view class="top-nav">
			<view class="navbar">
				<view class="scoll-wrapper">
					<view class="nav-item current">
						todo los bonos
					</view>
				</view>
			</view>
		</view>
		
		<scroll-view
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
		
			<!-- 空白页 -->
			<empty v-if="couponList.length === 0"></empty>
			
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
				couponList: [],
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
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		font-family: $font-family;
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
</style>
