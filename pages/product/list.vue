<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				Ordenar
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				Ventas
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>precio</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view 
				v-for="(item, index) in goodsList" :key="index"
				class="goods-item"
				@click="navToDetailPage({id: item.goods_id})"
			>
				<view class="image-wrapper">
					<image :src="item.goods_image" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.goods_name}}</text>
				<view class="price-box">
					<text class="price">{{item.goods_price}}</text>
					<text>vendido  {{item.goods_salenum}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.gc_id">
						<view class="cate-item b-b two">{{item.gc_name}}</view>
						<view 
							v-for="tItem in item.child" :key="tItem.gc_id" 
							class="cate-item b-b" 
							:class="{active: tItem.gc_id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.gc_name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import core from '@/utils/core';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition:"fixed",
				headerTop:"44px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				fid: 0, //一级分类
				sid: 0, //二级分类
				tid: 0, //三级分类
				cateId: 0, //已选分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				searchname: '',//关键字搜索
				moretype: 0,//1热门推荐 2销量排行 3新品上架
				page: 1,//分页
				orderby: '', //排序 默认综合排序 saledesc销量优先 priceup价格升 pricedo价格降
			};
		},
		
		onLoad(options){
			this.cateId = options.tid || 0;
			this.fid = options.fid || 0;
			this.sid = options.sid || 0;
			this.tid = options.tid || 0;
			this.moretype = options.moretype || 0;
			this.searchname = options.searchname || '';
			this.loadCateList(this.fid,this.sid);
			this.loadData();
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.page = 1;
			this.goodsList = [];
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: `/pages/search/search`
			})
		},
		methods: {
			//加载分类
			async loadCateList(fid, sid){
				let that = this;
				let list = [];
				core.get('AppGoods/get_all_category',{},function(data){
					if(data){
						list = data;
						let cateList = list.filter(item=>item.gc_parent_id == fid);
						
						cateList.forEach(item=>{
							let tempList = list.filter(val=>val.gc_parent_id == item.gc_id);
							item.child = tempList;
						})
						that.cateList = cateList;
					}
				});
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				if(this.filterIndex === 0){
					this.orderby = '';
				}else if(this.filterIndex === 1){
					this.orderby = 'saledesc';
				}else if(this.filterIndex === 2){
					if(this.priceOrder == 1){
						this.orderby = 'priceup';
					}else{
						this.orderby = 'pricedo';
					}
				}
				let that = this;
				let param = {
					page: that.page,
					fid: that.fid,
					sid: that.sid,
					tid: that.tid,
					moretype: that.moretype,
					searchname: that.searchname,
					orderby: that.orderby
				};
				// console.log('param',param)
				core.get('AppGoods/getAllGoodsList',param,function(res){
					uni.hideLoading();
					// console.log('goodsList',res)
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
					if(type === 'refresh'){
						if(loading == 1){
							uni.hideLoading()
						}else{
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			//筛选点击
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.page = 1;
				this.goodsList = [];
				this.loadData('refresh', 1);
			},
			//显示分类面板
			toggleCateMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(()=>{
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
				this.cateId = item.gc_id;
				if(item.level == 2){
					this.fid = item.gc_parent_id;
					this.sid = item.gc_id;
					this.tid = 0;
				}else if(item.level == 3){
					this.fid = 0;
					this.sid = item.gc_parent_id;
					this.tid = item.gc_id;
				}
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.page = 1;
				this.goodsList = [];
				this.loadData('refresh', 1);
			},
			//详情
			navToDetailPage(item){
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page {
		font-family: $font-family;
	}
	page, .content{
		background: $page-color-base;
	}
	.content{
		padding-top: 96upx;
	}

	.navbar{
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.goods-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			&:before{
				content: '￥';
				font-size: 26upx;
			}
		}
	}
	

</style>
