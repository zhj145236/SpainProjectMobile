<template>
	<view class="content">
		<view class="fui-cell-group" >
			<view class="fui-cell" >
				<view class="fui-cell-info color" style="color: #333;font-size:32upx;">
					solicitud de decolucion en espera
				</view>
			</view>
			<view class="apply send-code" style="padding-top:0;color: #999;font-size: 26upx;line-height: 48upx;">
				paso para solicitar reembolso de dinero：
				<view>1、enviar solicitud de reembolso de dinero</view>
				<view>2、 dinera será depositado a su cuenta, cuando el comercio confirma la solicitud de reembolso</view>
				<view>Si el comerciante no maneja: por favor, póngase en contacto con el comerciante a tiempo</view>
			</view>
		</view>
		
		<view class="fui-cell-group">
			<view class="fui-cell">
				<view class="fui-cell-label">tipo de servicio</view>
				<view class="fui-cell-info">
				    reembolso de dinero
				</view>
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">
			        {{rtypeArrText[rtypeIndex]}} Causa
			    </view>
			    <view class="fui-cell-info">
					<!-- <picker @change="change" :range="reasonArr" :data-name="reasonIndex" :value="reasonIndex">{{reasonArr[reasonIndex]}}</picker> -->
			        <text>cancelacion pedido, reembolso total</text>
			    </view>
			    <!-- <view class="fui-cell-remark"></view> -->
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">{{rtypeArrText[rtypeIndex]}} Descripción</view>
				<view class="fui-cell-info">
					<input type="text" class="fui-input " placeholder="favor indicar descripcion del reembolso" v-model="content" />
					<!-- <text>{{content}}</text> -->
				</view>
			</view>
			<view class="fui-cell">
				<view class="fui-cell-label">{{rtypeArrText[rtypeIndex]}} Importe</view>
				<view class="fui-cell-info">
					<text style="color:#ef4f4f;">￥{{orderInfo.order_amount}}</text>
				</view>
			</view>
			<view class="fui-cell ">
			    <view class="fui-cell-label" style="flex:5;">cargar pruebas</view>
			    <view class="fui-images" style="flex:15;">
			        <block v-for="(item,index) in images" :key="index">
						<image :data-index="index" :src="item" class="image image-sm" data-type="image-preview" @click="upload" style="width:120rpx;height:120rpx;"></image>
						<text :data-index="index" class="image-remove" data-type="image-remove" @click="upload">×</text>
			        </block>
			    </view>
			    <view class="fui-uploader" style="width:120rpx;height:120rpx;margin:0;" data-type="image" @click="upload"></view>
			    <view class="fui-cell-info"></view>
			</view>
			
			<!-- <view class="fui-cell">
			    <view class="fui-cell-label">申请时间</view>
			    <view class="fui-cell-info">{{refund.createtime}}</view>
			</view> -->
			
		</view>
		
		<view class="btn-group">
			<view class="mix-btn" @click="confirm">enviar solicitud</view>
			<view class="mix-btn hollow" @click="cancel">cancelar solicitud</view>
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
				rtypeArr: ["退款(仅退款不退货)", "退货退款", "换货"],
				rtypeArrText: ["reembolso de dinero", "reembolso de dinero", "换货"],
				rtypeIndex: 1,
				reasonArr: ["no quiero", "producto en escasez", "error/datos erroneo en el pedido", "otros"],
				reasonIndex: 0,
				images: [],
				submitimgs: [],
				content: '',
			}
		},
		onLoad(options){
			this.orderInfo = JSON.parse(options.orderinfo);
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			if(!that.memberid){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
		},
		methods: {
			confirm(){
				let that = this;
				let buyer_message = that.content;
				if(buyer_message=='' || buyer_message == ' '){
					that.$api.msg("favor indicar descripcion del reembolso");
					return;
				}
				let param = {
					memberid:that.memberid,
					order_id:that.orderInfo.order_id,
					pic_info:that.submitimgs,
					refund_type:1,
					buyer_message: buyer_message
				};
				core.get('AppOrder/refundSubmit',param,function(res){
					uni.hideLoading();
					if(res.state>0){
						that.$api.msg("envio exitoso");
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
			cancel(){
				uni.navigateBack();
			},
			change(e){
				let that = this;
				that.reasonIndex = e.target.value;
			},
			upload(e){
				let that = this;
				let type = e.target.dataset.type;
				let index = e.target.dataset.index;
				if(type=="image"){
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
					    success: (re) => {
							uni.showToast({
								title: 'En cargando...',
								icon: "loading",
								duration: 5e6
							});
					        const tempFilePaths = re.tempFilePaths;
					        uni.uploadFile({
					            url: 'https://shops.domibuy.com/public/index.php/h5api/AppUploader/upload?memberid='+that.memberid,
					            filePath: tempFilePaths[0],
					            name: 'file',
					            success: (res) => {
									uni.hideToast();
									var ret = JSON.parse(res.data);
					                // console.log('上传',ret);
									var images = [];
									var submitimgs = [];
									if(ret.state == 0){
										uni.showModal({
											content: ret.msg,
											showCancel: false
										})
										return
									}else{
										images.push(ret.pic_url);
										submitimgs.push(ret.pic_name);
										that.images = images;
										that.submitimgs = submitimgs;
									}
					            }
					        });
					    }
					});
				}else if(type=="image-preview"){
					uni.previewImage({
						current: that.images[index],
						urls: that.images
					});
				}else if(type=="image-remove"){
					let images = that.images;
					let submitimgs = that.submitimgs;
					images.splice(index, 1);
					submitimgs.splice(index, 1);
					that.images = images;
					that.submitimgs = submitimgs;
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		font-family: $font-family;
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
			    width: 160rpx;
			    padding: 0 8rpx;
			    font-size: 30rpx;
			}
			.fui-cell-info {
			    -webkit-flex: 1;
			    flex: 1;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			    overflow: hidden;
			    font-size: 30rpx;
			    color: #666;
			}
			.fui-cell-remark {
			    color: #888;
			    text-align: right;
			    font-size: 30rpx;
			    margin-right: 8rpx;
			}
			.fui-cell-remark:after {
			    content: " ";
			    display: inline-block;
			    -webkit-transform: rotate(45deg);
			    transform: rotate(45deg);
			    height: 12rpx;
			    width: 12rpx;
			    border-width: 2px 2px 0 0;
			    border-color: #c8c8cd;
			    border-style: solid;
			    position: relative;
			    top: -1px;
			    margin-left: .3em;
			}
			.fui-images {
			    list-style: none;
			    padding-top: 8rpx;
				.image {
				    float: left;
				    margin-right: 12rpx;
				    margin-bottom: 12rpx;
				    width: 160rpx;
				    height: 160rpx;
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
			    margin-right: 12rpx;
			    margin-bottom: 12rpx;
			    width: 160rpx;
			    height: 160rpx;
			    border: 2rpx solid #d9d9d9;
			}
			.fui-uploader:after {
			    width: 80rpx;
			    height: 2rpx;
			}
			.fui-uploader:before {
			    width: 2rpx;
			    height: 80rpx;
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
		    left: 20rpx;
		    right: 20rpx;
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
			font-size: 26rpx;
		    padding: 20rpx;
		    font-size: 30rpx;
		    color: #666;
		}
	}
	.fui-cell-group:not(.fui-cell-group-o):before {
	    content: " ";
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 0;
	    border-top: 2rpx solid #d9d9d9;
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
