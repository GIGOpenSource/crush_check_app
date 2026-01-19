<template>
	<view class="page">
		<view class="jz" @click="path('/pages/index/opeare')">
			<view class="left">
				<view class="t1">{{ t('index.crushCheck') }}</view>
				<view>{{ t('index.checkYourself') }}</view>
				<view>{{ t('index.wayAndData') }}</view>
				<view>{{ t('index.cheater') }}</view>
			</view>
			<view class="right">
				<image :src="$getImg('index/jz')" />
			</view>
		</view>
		<view class="bottom">
			<view class="left" @click="path('/pages/index/answer')">
				<view>
					<view>{{ t('index.answer') }}</view>
					<view>{{ t('index.book') }}</view>
				</view>
				<image :src="$getImg('index/answer')"  />
			</view>
				<view class="left" @click="path('/pagesA/tarotcards/qusetion')">
				<view style="margin-left: 50rpx;width: 200rpx;">
					<view>塔罗牌</view>
					<view></view>
				</view>
				<image :src="$getImg('index/tarotcards')"  style="width: 300rpx;margin-left: 0;"/>
			</view>
		</view>
		<!-- <view class="bottom">
			<view class="left" @click="path('/pages/index/answer')">
				<view>
					<view>{{ t('index.answer') }}</view>
					<view>{{ t('index.book') }}</view>
				</view>
				<image :src="$getImg('index/answer')" mode="widthFix" />
			</view>
			<view class="right">
				<view>{{ t('index.moreFeatures') }}</view>
				<view>{{ t('index.comingSoon') }}</view>
			</view>
		</view> -->
	</view>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
	onLoad
} from '@dcloudio/uni-app'
import {
	share
} from '@/api/index.js'
const { t } = useI18n();

const path = (url) => {
	uni.removeStorageSync('question');
	uni.navigateTo({ url })
}
onLoad((e) => {
	if (e.scene) {
		uni.setStorageSync("inviter_openid", e.scene);
		if (!uni.getStorageSync('token')) {
			uni.navigateTo({
				url: "/pages/login/login"
			})
			return
		}
		share({
			shareId: e.scene,
		}).then((res) => {
			console.log(res, "share record");
		});
	}
})
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	height: 100vh;
	padding: 20rpx 25rpx;
	box-sizing: border-box;
}

.jz {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 70rpx 60rpx;
	border: 0.5px solid rgba(255, 255, 255, 0.3);
	background: #2B2848;
	border-radius: 20rpx;

	image {
		width: 200rpx;
		height: 200rpx;
		vertical-align: middle;
	}

	view {
		font-weight: 100;
		font-size: 30rpx;
		line-height: 40rpx;
		letter-spacing: 3.5rpx;
	}

	.t1 {
		font-size: 70rpx;
		font-weight: 500;
		margin-bottom: 30rpx;
	}
}

.bottom {
	margin-top: 25rpx;
	display: flex;
	justify-content: space-between;

	image {
		width: 120rpx;
		height: 160rpx;
		margin-left: 50rpx;
	}

	.left,
	.right {
		border: 0.5px solid rgba(255, 255, 255, 0.3);
		background: #2B2848;
		width: 48%;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 230rpx;
	}

	.left {
		font-weight: 500 !important;
	}

	.right {

		flex-direction: column;
		font-weight: 100;
		letter-spacing: 2rpx;
		font-size: 30rpx;
	}

}
</style>