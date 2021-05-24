<template>
	<view class="fui-page page-shop-notice-detail" v-if="show">
	  <view class="fui-content">
	    <view class="fui-article">
	      <view class="title">{{title}}</view>
	      <view class="subtitle">
	        tiempo de publicacion：{{createtime}}
	      </view>
	      <view class="hr"></view>
	      <view name="detail" class="content content-block">
	        <view class="wxParse">
				<view class="parse-con">
					<u-parse :content="content"></u-parse>
				</view>
	        </view>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script>
	import uParse from "@/components/feng-parse/parse.vue";
	import core from '@/utils/core';
	export default {
		components:{
			uParse
		},
		data() {
			return {
				show: !1,
				id: 0,
				title: '',
				createtime: '',
				content: '',
			};
		},
		onLoad(options) {
			this.loadData(options);
		},
		methods: {
			async loadData(options) {
				let that = this;
				that.id = options.id;
				core.get('AppNotice/getdetail',{article_id:options.id},function(data){
					if(data){
						uni.hideLoading();
						that.show = !0;
						that.title = data.article_title;
						that.createtime = data.article_time;
						that.content = data.article_content;
					}
				});
			}
		}
		
	}
</script>

<style>
	.page-shop-notice-detail .fui-content .fui-article {
	    padding-top: 0.5rem;
	}
	.page-shop-notice-detail .fui-content .fui-article .title {
	    text-align: center;
	    font-size: 32upx;
	    font-weight: bold;
	}
	.page-shop-notice-detail .fui-content .fui-article .subtitle {
	    text-align: center;
	    font-size: 28upx;
	}
	.page-shop-notice-detail .fui-content .fui-article .hr {
	    border: 0;
	    border-top: 1px solid #e0e0e0;
	    margin-top: 20upx;
	}
	.page-shop-notice-detail .fui-content .fui-article .content {
	    margin-top: 1em;
	}
	.page-shop-notice-detail .fui-content .fui-article .content .wxParse {
	    margin: 0 10upx;
	    font-family: Helvetica, sans-serif;
	    font-size: 28upx;
	    color: #666;
	    line-height: 1.8;
	}
</style>
