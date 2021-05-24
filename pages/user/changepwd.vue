<template>
	<view class="content">
		
		<view class="fui-cell-group" >
			<view class="fui-cell" >
				<view class="fui-cell-label">contrasena actual</view>
				<view class="fui-cell-info">
				    <input type="password" class="fui-input " placeholder="favor ingresar contrasena actual" v-model="oldpwd" />
				</view>
			</view>
			<view class="fui-cell" >
				<view class="fui-cell-label">nueva contrasena</view>
				<view class="fui-cell-info">
				    <input type="password" class="fui-input " placeholder="favor ingresar nueva contrasena" v-model="newpwd" />
				</view>
			</view>
			<view class="fui-cell" >
				<view class="fui-cell-label">confirmar contrasena</view>
				<view class="fui-cell-info">
				    <input type="password" class="fui-input " placeholder="favor ingresar nueva contrasena" v-model="newpwd2" />
				</view>
			</view>
			
		</view>
		
		<view class="btn-group">
			<view class="mix-btn" @click="saveInfo">confirmar la modificacion</view>
		</view>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				memberid: 0,
				oldpwd: '',
				newpwd: '',
				newpwd2: '',
			};
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.memberid = res.data.member_id;
			    }
			});
		},
		methods: {
			saveInfo(){
				let that = this;
				if(!that.oldpwd){
					that.$api.msg('favor ingresar contrasena actual');
					return;
				}
				if(!that.newpwd){
					that.$api.msg('favor ingresar nueva contrasena');
					return;
				}
				if(!that.newpwd2){
					that.$api.msg('favor ingresar nueva contrasena');
					return;
				}
				if(that.newpwd2 != that.newpwd){
					that.$api.msg('error en ingresar la contrasena');
					return;
				}
				let param = {
					memberid: that.memberid,
					oldpwd: that.oldpwd,
					newpwd: that.newpwd,
					newpwd2: that.newpwd2
				};
				core.get('AppMember/changepwd',param,function(res){
					uni.hideLoading();
					if(res.state > 0){
						that.$api.msg("modificacion cpmpletada");
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
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		font-family: $font-family;
	}
	.fui-list-group {
	    background-color: #fff;
	    position: relative;
	    margin-top: 20upx;
	    position: relative;
		.fui-list {
		    position: relative;
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: -ms-flexbox;
		    display: flex;
		    padding: 16upx 24upx;
		    -moz-transition-duration: 300ms;
		    -webkit-transition-duration: 300ms;
		    transition-duration: 300ms;
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    -ms-flex-align: center;
		    align-items: center;
		    overflow: hidden;
			.fui-list-inner {
			    position: relative;
			    width: 100%;
			    overflow: hidden;
			    box-sizing: border-box;
			    display: -webkit-box;
			    display: -webkit-flex;
			    display: flex;
			    -webkit-box-flex: 1;
			    -webkit-flex: 1;
			    -ms-flex: 1;
			    flex: 1;
			    display: block;
			}
			.fui-list-img {
			    display: -webkit-box;
			    display: -webkit-flex;
			    display: flex;
			    -webkit-flex-shrink: 0;
			    -ms-flex: 0 0 auto;
			    -webkit-flex-shrink: 0;
			    flex-shrink: 0;
			    -webkit-box-lines: single;
			    -moz-box-lines: single;
			    -webkit-flex-wrap: nowrap;
			    flex-wrap: nowrap;
			    box-sizing: border-box;
			    -webkit-box-align: center;
			    -webkit-align-items: center;
			    align-items: center;
			    margin-right: 24upx;
			    color: #aaa;
			    position: relative;
			    margin-right: 0;
			}
			.angle {
			    color: #888;
			    text-align: right;
			    font-size: 30upx;
			    margin-right: 8upx;
			}
			.angle:after {
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
		}
		.fui-list:before {
		    content: " ";
		    position: absolute;
		    left: 0;
		    top: 0;
		    right: 20upx;
		    height: 1px;
		    border-top: 1px solid #ebebeb;
		    color: #ebebeb;
		    -webkit-transform-origin: 0 0;
		    -ms-transform-origin: 0 0;
		    transform-origin: 0 0;
		    -webkit-transform: scaleY(0.5);
		    -ms-transform: scaleY(0.5);
		    transform: scaleY(0.5);
		    left: 20upx;
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
			    padding: 0 8upx;
			    font-size: 30upx;
			}
			.fui-cell-info {
			    -webkit-flex: 1;
			    flex: 1;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			    overflow: hidden;
			    font-size: 30upx;
			    color: #666;
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
