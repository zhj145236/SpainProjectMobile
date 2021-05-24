<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">Contacto</text>
			<input class="input" type="text" v-model="addressData.address_realname" placeholder="Nombre del" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">teléfonomóvil</text>
			<input class="input" type="number" v-model="addressData.address_mob_phone" placeholder="Número de teléfonomóvil del destinatario" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">Dirección</text>
			<input class="input" type="text" v-model="addressData.address_detail" placeholder="Complete la direccióndetallada" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">Establecercomopredeterminado</text>
			<switch :checked="addressData.address_is_default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">Presentar</button>
	</view>
</template>

<script>
	import core from '@/utils/core';
	export default {
		data() {
			return {
				addressData: {
					member_id: 0,
					address_id: 0,
					address_realname: '',
					address_mob_phone: '',
					address_detail: '',
					address_is_default: false
				}
			}
		},
		onLoad(option){
			let title = 'Dirección de entregareciénagregada';
			let that = this;
			if(option.type==='edit'){
				title = 'Edite la dirección de entrega'
				
				this.addressData = JSON.parse(option.data)
			}else{
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						that.addressData.member_id = res.data.member_id;
				    }
				});
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				this.addressData.address_is_default = e.detail.value;
			},
			
			//提交
			confirm(){
				let that = this;
				let data = that.addressData;
				if(!data.address_realname){
					that.$api.msg('Indique el nombre del destinatario');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.address_mob_phone)){
					that.$api.msg('Introduzca el número de teléfonomóvilcorrecto');
					return;
				}
				if(!data.address_detail){
					that.$api.msg('Complete la direccióndetallada');
					return;
				}
				core.get('AppAddress/addoredit',data,function(data){
					uni.hideLoading();
					if(data.state == 0){
						uni.showModal({
							content: data.msg,
							showCancel: false
						})
						return
					}else{
						that.$api.msg(`La dirección se${that.manageType=='edit' ? 'modificócorrectamente': 'agregócorrectamente'}`);
						uni.navigateTo({
							url: `/pages/address/address`
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
		font-family: $font-family;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
