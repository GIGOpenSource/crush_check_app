<template>
	<view class="page">
		<view class="jz" @click="path('/pages/index/opeare')">
			<view class="left">
				<view class="t1">鉴渣</view>
				<view>鉴定自己的说话</view>
				<view>方式和资料，像不像</view>
				<view>渣男渣女</view>
			</view>
			<view class="right">
				<image :src="$getImg('index/jz')" />
			</view>
		</view>
		<view class="bottom">
			<view class="left" @click="path('/pages/index/answer')">
				<view><view>答案</view><view>之书</view></view>
				<image :src="$getImg('index/answer')" mode="widthFix"/>
			</view>
			<view class="right">
				<view>更多功能</view>
				<view>敬请期待</view>
			</view>
		</view>
	</view>
</template>

<script setup>
const path = (url) => {
  uni.navigateTo({url})
}
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
	.left{
        font-weight: 500 !important;
	}
	.right{
		
		flex-direction: column;
		font-weight: 100;
		letter-spacing: 2rpx;
		font-size: 30rpx;
	}

}
</style>