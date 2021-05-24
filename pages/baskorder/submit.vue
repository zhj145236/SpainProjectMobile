<template>
	<view class="content">
		
		<view class="fui-cell-group">
			<view class="fui-cell" >
				<view class="fui-cell-info color" style="color: #333;font-size:28upx;font-weight: bold;">
					Información de evaluación
				</view>
			</view>
			<view class="fui-cell">
				<view class="fui-cell-label">Información del producto：</view>
				<view class="fui-cell-info">
				    <image class="goods-img" :src="pinjiaList.geval_goodsimage" mode="aspectFill" style="width:60upx;height:60upx;vertical-align: middle;"></image>
				    <text style="padding-left:10upx;">{{pinjiaList.geval_goodsname}}</text>
				</view>
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">Evaluacióndel producto：</view>
			    <view class="fui-cell-info">
					<image class="shine" src="/static/temp/star-on.png" v-if="pinjiaList.geval_scores>=1"></image>
					<image class="shine" src="/static/temp/star-off.png" v-else></image>
					<image class="shine" src="/static/temp/star-on.png" v-if="pinjiaList.geval_scores>=2"></image>
					<image class="shine" src="/static/temp/star-off.png" v-else></image>
					<image class="shine" src="/static/temp/star-on.png" v-if="pinjiaList.geval_scores>=3"></image>
					<image class="shine" src="/static/temp/star-off.png" v-else></image>
					<image class="shine" src="/static/temp/star-on.png" v-if="pinjiaList.geval_scores>=4"></image>
					<image class="shine" src="/static/temp/star-off.png" v-else></image>
					<image class="shine" src="/static/temp/star-on.png" v-if="pinjiaList.geval_scores>=5"></image>
					<image class="shine" src="/static/temp/star-off.png" v-else></image>
			    </view>
			</view>
			<view class="fui-cell">
			    <view class="fui-cell-label">Contenido de la evaluación：</view>
				<view class="fui-cell-info">
					{{pinjiaList.geval_content}}
				</view>
			</view>
		</view>
		
		<view class="fui-cell-group" >
			<view class="fui-cell" >
				<view class="fui-cell-info color" style="color: #333;font-size:28upx;font-weight: bold;">
					Cargueimágenes para publicarpedidos
				</view>
			</view>
			<view class="fui-cell ">
			    <view class="fui-images" style="flex:15;">
			        <block v-for="(item,index) in images" :key="index">
						<image :data-index="index" :src="item" class="image image-sm" data-type="image-preview" @click="upload" style="width:120upx;height:120upx;"></image>
						<text :data-index="index" class="image-remove" data-type="image-remove" @click="upload">×</text>
			        </block>
			    </view>
			    <view class="fui-uploader" style="width:120upx;height:120upx;margin:0;" data-type="image" @click="upload"></view>
			    <view class="fui-cell-info"></view>
			</view>
		</view>
		
		<view class="btn-group">
			<view class="mix-btn" @click="confirm">Confirmar</view>
		</view>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				memberid: 0,
				pinjiaList: [],
				images: [],
				submitimgs: [],
			};
		},
		onLoad(option){
			let that = this;
			let pinjiaList = JSON.parse(option.goods);
			that.pinjiaList = pinjiaList;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
			// console.log('pinjiaList',pinjiaList)
		},
		methods: {
			confirm(){
				let that = this;
				let imgarr = that.submitimgs;
				let imgstr = '';
				if(imgarr.length==0){
					that.$api.msg("Subeunaimagen del pedido");
					return;
				}
				imgarr.forEach(item=>{
					imgstr += item + ',';
				})
				core.get('AppBaskorder/submit',{memberid:that.memberid,geval_id:that.pinjiaList.geval_id,imgstr:imgstr},function(res){
					uni.hideLoading();
					if(res.state>0){
						that.$api.msg("Enviado correctamente");
						uni.navigateBack({
						    delta: 1
						});
					}else{
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
						return
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

<style lang="scss">
	page{
		background: $page-color-base;
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
