<template>
	<view class="app">
		<view class="price-box">
			<text>Importe pagado</text>
			<text class="price">{{orderInfo.order_amount}}</text>
		</view>
		
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">Número de orden</text>
				<text class="cell-tip">{{orderInfo.order_sn}}</text>
			</view>

		</view>

		<view class="pay-type-list">

			<view class="type-item b-b">
				<text class="icon yticon icon-erjiye-yucunkuan" v-if="orderInfo.payment_code == 'predeposit'"></text>
				<image class="icon yticon icon-yuezhifu" src="/static/temp/yinhangka.png" style="width:52upx;height:52upx;margin-right:48upx;" v-if="orderInfo.payment_code=='bankpay'"></image>
				<view class="con">
					<text class="tit" v-if="orderInfo.payment_code == 'predeposit'">Pago del saldo</text>
					<text class="tit" v-if="orderInfo.payment_code == 'bankpay'">Remesas/transferencias bancarias</text>
					<text v-if="orderInfo.payment_code == 'predeposit'">可用余额 ¥198.5</text>
					<text v-if="orderInfo.payment_code == 'bankpay'">Cuenta de cobro：{{orderInfo.shoukuan_code}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" checked />
					</radio>
				</label>
			</view>
		</view>
		
		<view class="fui-cell-group" >
			<view class="fui-cell" >
				<view class="fui-cell-info color" style="color: #333;font-size:28upx;font-weight: bold;">Cargar documentos de pago</view>
			</view>
			<view class="fui-cell " v-if="orderInfo.tradeno_imgarr.length==0">
			    <view class="fui-images" style="flex:15;">
			        <block v-for="(item,index) in images" :key="index">
						<image :data-index="index" :src="item" class="image image-sm" data-type="image-preview" @click="upload" style="width:120upx;height:120upx;"></image>
						<text :data-index="index" class="image-remove" data-type="image-remove" @click="upload">×</text>
			        </block>
			    </view>
			    <view class="fui-uploader" style="width:120upx;height:120upx;margin:0;" data-type="image" @click="upload"></view>
			    <view class="fui-cell-info"></view>
			</view>
			<view class="fui-cell" v-else>
				<view class="fui-cell-info">Recordatorio: se han enviado sus comprobantes de pago, ¡espere el procesamiento de auditoría de servicio al cliente de la plataforma！</view>
			</view>
		</view>
		
		<text class="mix-btn" @click="confirm" v-if="orderInfo.tradeno_imgarr.length==0">confirmar pago</text>
		<text class="mix-btn" v-else>espera de autorizacion...</text>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				memberid: 0,
				orderInfo: {},
				remark: '',
				images: [],
				submitimgs: [],
			};
		},
		onLoad(options) {
			this.orderInfo = JSON.parse(options.orderinfo);
			this.images = this.orderInfo.tradeno_imgarr;
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
			core.get('AppOrder/getOrderDetail',{memberid:that.memberid,order_id:that.orderInfo.order_id,pay_sn:that.orderInfo.pay_sn},function(res){
				uni.hideLoading();
				// console.log('aaaa',res)
				if(res.state > 0){
					that.orderInfo = res.order_info;
					that.images = res.order_info.tradeno_imgarr;
				}
			});
		},

		methods: {
			//确认支付
			confirm: async function() {
				let that = this;
				let order_id = that.orderInfo.order_id;
				// let remark = that.remark;
				// if(remark == ''){
				// 	that.$api.msg("favor indicar el numero de serie de la transaccion  Bancario");
				// 	return;
				// }
				let imgarr = that.submitimgs;
				let imgstr = '';
				if(imgarr.length==0){
					that.$api.msg("Por favor, suba el certificado de pago");
					return;
				}
				imgarr.forEach(item=>{
					imgstr += item + ',';
				})
				core.get('AppOrder/payOrder',{memberid:that.memberid,order_id:order_id,imgstr:imgstr},function(res){
					uni.hideLoading();
					if(res.state == 0){
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
						return
					}else{
						uni.navigateBack({
						    delta: 1
						});
					}
				});
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
							// console.log('图片',tempFilePaths);
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
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}
	
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	
	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;
	
		&.cell-hover {
			background: #fafafa;
		}
	
		&.b-b:after {
			left: 30upx;
		}
	
		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;
	
			&.hb {
				background: #ffaa0e;
			}
	
			&.lpk {
				background: #3ab54a;
			}
	
		}
	
		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}
	
		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}
	
		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
	
			&.disabled {
				color: $font-color-light;
			}
	
			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}
	
		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}
	
		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 1.5;
		}
		
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 20upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
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
			font-size: 26upx;
			color: #666;
			.fui-cell-label {
			    position: relative;
			    display: block;
			    width: 160upx;
			    padding: 0 8rpx;
			}
			.fui-cell-info {
			    -webkit-flex: 1;
			    flex: 1;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			    overflow: hidden;
				.shine {
					width: 32upx;
					height: 32upx;
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
	}

</style>
