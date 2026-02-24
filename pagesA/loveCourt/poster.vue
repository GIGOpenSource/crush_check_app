<template>
    <view class="page">
    <view class="look" @click="path('look')">查看资料</view>
        <view class="top">
            <text class="title">爱的裁判所</text>
        </view>
        <view class="content">
            <Loveposter @success="handlePosterSuccess" @fail="handlePosterFail" />
        </view>
        <view class="bottom">
            <view class="border">
                <view @click="path('share')">分享结果</view>
                <view @click="path('again')">再来一次</view>
                <view class="back" @click="path('back')">返回首页</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import Loveposter from '@/components/Loveposter/Loveposter.vue';
import { ref } from 'vue';

const posterImg = ref('');
const posterError = ref(false);

const handlePosterSuccess = (filePath) => {
    if (filePath) {
        posterImg.value = filePath
        posterError.value = false
    } else {
        console.error('海报路径为空')
        posterError.value = true
    }
}

const handlePosterFail = (error) => {
    console.error('海报生成失败:', error)
    posterError.value = true
}
const path = (type) => {
    if (type == 'share') {
        if (!posterImg.value) {
            uni.showToast({
                title: t('mbti.posterNotReady'),
                icon: 'none',
                duration: 2000
            })
            return
        }
        const inviterOpenId = uni.getStorageSync("openId") || "";
        const query = `?scene=${inviterOpenId}`
        wx.showShareImageMenu({
            path: posterImg.value,
            entrancePath: `/pages/index/index${query}`,
            complete: (res) => {
                if (res.errMsg == 'showShareImageMenu:fail cancel') {
                    // share_fail()

                } else {
                    // share_success()

                }
            }
        })
    } else if (type == 'again') {
        uni.redirectTo({ url: '/pagesA/loveCourt/index' })
    } else if (type == 'back') {
        uni.switchTab({ url: '/pages/index/index' })
    } else if(type == 'look'){
        uni.navigateTo({ url: '/pagesA/loveCourt/materail' })
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding: 20rpx 30rpx;
}

.top {
    width: 100%;
    text-align: center;
}
.look{
    position: absolute;
    top: 135rpx;
    right: 60rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.5);
}
.content {
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    min-height: 82vh;
    margin-top: 30rpx;
    box-sizing: border-box;
    overflow-y: scroll;
    background: #2a2935;
}

.bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #3F3E49;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    font-weight: 300;
    font-size: 28rpx;

    .border {
        border: 1px solid rgba(255, 255, 255, 0.3);
        width: 100%;
        display: flex;
        height: 90rpx;
        border-radius: 90rpx;

        view {
            width: 33.33%;
            text-align: center;
            line-height: 90rpx;
            border-right: 0.5rpx solid rgba(255, 255, 255, 0.3);
        }

        .back {
            border: none;
        }
    }
}
</style>