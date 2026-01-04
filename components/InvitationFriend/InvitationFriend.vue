<template>
    <view class="invitation-friend">
        <up-popup :show="show" :closeable="true" position="bottom" round="20" @close="handleClose" @open="show = true">
            <view>
                <view class="title t1">转发邀请</view>
                <view class="title">点击复制按钮，复制链接邀请</view>
                <view class="btn" @click="copy">复制链接</view>
                <view class="bottom">
                    <view @click="share('WXSceneSession')">
                        <image :src="$getImg('index/wx')" mode="scaleToFill" />
                        <view>微信好友</view>
                    </view>
                    <view @click="share('WXSceneTimeline')">
                        <image :src="$getImg('index/quan')" mode="scaleToFill" />
                        <view>朋友圈</view>
                    </view>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script setup>
const props = defineProps({
     show: {
		type: Boolean,
		default: false
	},
    imageUrl: {
		type: String,
		default: '/static/index/yq.png'
	},
    downloadUrl: {
        type: String,
        default: '/static/index/yq.png'
    }
});
const emits = defineEmits(["update:show", "close"])
const handleClose = () => {
	emits("close");
	emits("update:show", false);
}
const share = (type) => {
    	const inviterOpenId = uni.getStorageSync("openId") || "";
	const query = `?scene=${inviterOpenId}`
	uni.share({
		provider: "weixin",
		scene: type,
		type: props.imageUrl == '/static/index/yq.png'? 0 : 2,
		title: "CrushCheck",
		summary: '邀请好友一起来测测自己渣不渣',
		href: `https://crashcheck.net/h5/${query}`,
		imageUrl: props.imageUrl,
		success: function (res) {
			console.log("success:" + JSON.stringify(res));
		},
		fail: function (err) {
			console.log("fail:" + JSON.stringify(err));
		}
	});
}
const copy = () => {
    	const inviterOpenId = uni.getStorageSync("openId") || "";
    const query = `?scene=${inviterOpenId}`
    let url = props.imageUrl == '/static/index/yq.png' ? `https://crashcheck.net/h5/${query}` :  props.downloadUrl
    uni.setClipboardData({
        data: url,
        success: () =>{
            uni.showToast({
                title: '链接已复制到剪贴板',
                icon: 'none'
            });
        }
    });
}
</script>
<style lang="scss" scoped>
.invitation-friend {
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 26rpx;
}

.title {
    margin-top: 30rpx;
    text-align: center;
}

.t1 {
    font-size: 32rpx;
}

.btn {
    width: 70%;
    background: #B370FF;
    color: #fff;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 32rpx;
    margin: 40rpx auto;
    border-radius: 80rpx;
}
.bottom{
    display: flex;
    justify-content: space-around;
    width: 70%;
    margin: 0 auto;
    margin-top: 20rpx;
    margin-bottom: 20rpx;

    view {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24rpx;
    }

    image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 10rpx;
    }
}
</style>