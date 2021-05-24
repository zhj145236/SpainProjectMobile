<template>
	<view class="content">
		<view class="order-item">
			<view class="i-top b-b">
				<text class="time">numero de pedido：{{orderInfo.order_sn}}</text>
				<text class="state">{{orderInfo.create_time}}</text>
			</view>
			
			<view class="goods-box-single" v-for="(item,index) in orderInfo.order_goods" :key="index">
				<image class="goods-img" :src="item.goods_image" mode="aspectFill"></image>
				<view class="right">
					<text class="title clamp">{{item.goods_name}}</text>
					<text class="attr-box" v-if="item.option_name">Especificaciones：{{item.option_name}}</text>
					<text class="price">{{item.goods_price}} x {{item.goods_num}}</text>
				</view>
			</view>
		</view>
		
		<view class="fui-cell-group">
			<view class="fui-cell">
				<view class="fui-cell-label" style="color: #666;">opinar pedido</view>
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">
			        Puntuación：
			    </view>
			    <view class="fui-cell-info">
					<block v-for="(item,index) in stars_class" :key="index">
						<image class="shine" :data-key="index" :src="key>=index?selectedSrc:normalSrc" @click="select"></image>
					</block>
			    </view>
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">evaluación：</view>
			</view>
			<view class="textarea">
			  <textarea placeholder="comparte su experiencia  de la compra" v-model="content"></textarea>
			</view>
			
		</view>
		
		<view class="btn-group">
			<view class="mix-btn" @click="confirm">enviar evaluacion</view>
		</view>
		
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				memberid: 0,
				orderInfo: {},
				stars_class: ["fui-label-default", "fui-label-primary", "fui-label-success", "fui-label-warning", "fui-label-danger"],
				normalSrc: "/static/temp/star-off.png",
				selectedSrc: "/static/temp/star-on.png",
				key: -1,
				content: '',
			};
		},
		onLoad(option){
			let that = this;
			let orderInfo = JSON.parse(option.orderinfo);
			that.orderInfo = orderInfo;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
		},
		methods: {
			select(e){
				this.key = e.currentTarget.dataset.key;
			},
			confirm(){
				let that = this;
				if(that.key<0){
					that.$api.msg("seleccionar su puntuacion");
					return;
				}
				if(that.content == '' || that.content == ' '){
					that.$api.msg("favor ingresar contenido de la evaluacion");
					return;
				}
				core.get('AppOrder/commentSubmit',{memberid:that.memberid,order_id:that.orderInfo.order_id,scores:that.key,content:that.content},function(res){
					uni.hideLoading();
					if(res.state>0){
						that.$api.msg("Evaluar el éxito");
						uni.navigateBack();
					}else{
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
						return
					}
				});
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
		height: 100%;
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
				color: $font-color-light;
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
			}
		}
	}
	.fui-cell-group {
	    margin-top: 20upx;
	    background-color: #fff;
	    line-height: 1.4;
	    font-size: 32upx;
	    overflow: hidden;
	    position: relative;
		.fui-cell {
		    position: relative;
		    padding: 25upx;
		    display: -webkit-flex;
		    display: flex;
		    -webkit-align-items: center;
		    align-items: center;
		    -moz-transition-duration: .3s;
		    transition-duration: .3s;
		    transition-property: background-color;
			.fui-cell-label {
			    position: relative;
			    display: block;
			    width: 160upx;
			    padding: 0 8rpx;
				font-size: 30upx;
			}
			.fui-cell-info {
			    -webkit-flex: 1;
			    flex: 1;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			    overflow: hidden;
				font-size: 30rpx;
				color: #666;
				.shine {
					width: 50upx;
					height: 50upx;
					vertical-align: middle;
				}
			}
			.fui-cell-remark {
			    color: #888;
			    text-align: right;
			    font-size: 30upx;
			    margin-right: 8upx;
			}
			.fui-cell-remark:after {
			    content: " ";
			    display: inline-block;
			    -webkit-transform: rotate(45deg);
			    transform: rotate(45deg);
			    height: 12upx;
			    width: 12upx;
			    border-width: 2px 2px 0 0;
			    border-color: #c8c8cd;
			    border-style: solid;
			    position: relative;
			    top: -1px;
			    margin-left: .3em;
			}
			.fui-images {
			    list-style: none;
			    padding-top: 8upx;
				.image {
				    float: left;
				    margin-right: 12upx;
				    margin-bottom: 12upx;
				    width: 160upx;
				    height: 160upx;
				    background: no-repeat center center;
				    background-size: cover;
				    position: relative;
				    overflow: hidden;
				}
				.image-remove {
					position: relative;
					top: -15px;
					right: 5px;
					color: red;
				}
			}
			.fui-uploader {
			    float: left;
			    position: relative;
			    margin-right: 12upx;
			    margin-bottom: 12upx;
			    width: 160upx;
			    height: 160upx;
			    border: 2upx solid #d9d9d9;
			}
			.fui-uploader:after {
			    width: 80upx;
			    height: 2upx;
			}
			.fui-uploader:before {
			    width: 2upx;
			    height: 80upx;
			}
			.fui-uploader:after, .fui-uploader:before {
			    content: " ";
			    position: absolute;
			    top: 50%;
			    left: 50%;
			    -webkit-transform: translate(-50%,-50%);
			    transform: translate(-50%,-50%);
			    background-color: #d9d9d9;
			}
		}
		.fui-cell:before {
		    content: " ";
		    position: absolute;
		    left: 20upx;
		    right: 20upx;
		    top: 0;
		    height: 1px;
		    border-top: 1px solid #d9d9d9;
		    color: #d9d9d9;
		    -webkit-transform-origin: 0 0;
		    transform-origin: 0 0;
		    -webkit-transform: scaleY(.5);
		    transform: scaleY(.5);
		}
		.apply {
			display: block;
			font-size: 26upx;
		    padding: 20upx;
		    font-size: 30upx;
		    color: #666;
		}
		.textarea {
		    padding: 0 30upx;
		    color: #999;
		    font-size: 30upx;
		}
	}
	.fui-cell-group:not(.fui-cell-group-o):before {
	    content: " ";
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 0;
	    border-top: 2upx solid #d9d9d9;
	    color: #d9d9d9;
	    -webkit-transform-origin: 0 0;
	    transform-origin: 0 0;
	    -webkit-transform: scaleY(.5);
	    transform: scaleY(.5);
	}
	.btn-group{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
