<template>
    <view class="invitation-friend">
        <up-popup :show="show" :closeable="true" position="bottom" round="20" @close="handleClose" @open="show = true">
            <view>
                <view class="title t1">{{ t('invitationFriend.title') }}</view>
                <view class="title">{{ t('invitationFriend.desc') }}</view>
                <view class="btn" @click="copy">{{ t('invitationFriend.copyBtn') }}</view>
                <view class="bottom">
                    <view @click="share('WXSceneSession')">
                        <image :src="$getImg('index/wx')" mode="scaleToFill" />
                        <view>{{ t('invitationFriend.wxFriend') }}</view>
                    </view>
                    <view @click="share('WXSceneTimeline')">
                        <image :src="$getImg('index/quan')" mode="scaleToFill" />
                        <view>{{ t('invitationFriend.wxTimeline') }}</view>
                    </view>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
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
		summary: t('invitationFriend.shareSummary'),
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
                title: t('invitationFriend.copySuccess'),
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