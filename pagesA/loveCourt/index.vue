<template>
    <view class="page">
        <view class="titlecon">
            <view class="t1">AI恋爱法庭</view>
            <view class="del">清空</view>
        </view>
        <view class="content">
            <view class="input"><input type="text" placeholder="输入您的昵称" placeholder-style="color:#ffffff;"></view>
            <view>
                <textarea placeholder="输入事件，如发生了什么事" placeholder-style="color:#ffffff;"></textarea>
            </view>
            <view>
                <textarea placeholder="输入问题，如委屈或不适的问题点" placeholder-style="color:#ffffff;"></textarea>
            </view>
            <view class="title">补充材料上传：</view>
            <!-- 照片 -->
            <view class="images">
                <view class="update">
                    <image src="/static/index/bg.png" mode="scaleToFill" />
                    <view class="close"><up-icon name="close" color="#ffffff" size="26"></up-icon></view>
                </view>
                <view class="update">+</view>
            </view>
        </view>
        <view class="bottom">
            <view class="top"> <up-avatar :src="src" size="36"></up-avatar>
                <text>未邀请对方</text>
                <!-- <text>已加入</text> -->

            </view>
            <view class="btn">
                <image :src="$getImg('add/wx')" mode="widthFix" /> 转发邀请
            </view>
        </view>
    </view>
    <!-- 恋爱裁判所弹框  -->
    <IndexProup :show="tishi" @close="tishi = false">
        <template #content>
            <view class="tishi">
                <view class="title">恋爱裁判所</view>
                <scroll-view class="agreement-content" scroll-y>
                    <rich-text v-if="userAgreementContent" :nodes="userAgreementContent"
                        class="richtext-content"></rich-text>
                </scroll-view>
                <view class="btn" @click="handleAgree">去使用</view>
            </view>

        </template>
    </IndexProup>
</template>

<script setup>
import { ref } from 'vue'
const tishi = ref(false)
const userAgreementContent = ref('2222222')
const src = ref('222')
</script>

<style lang="scss" scoped>
.page {
    margin: 40rpx 25rpx;
}

.titlecon {
    width: 100%;

    .t1 {
        width: 100%;
        text-align: center;
    }

    .del {
        position: absolute;
        right: 20rpx;
        top: 40rpx;
        color: rgba(255, 255, 255, 0.5);
    }
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;
    max-height: 80vh;

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 600rpx;
        margin-bottom: 20rpx;
        flex: 1;
        overflow-y: auto;
    }

    .richtext-content {
        width: 100%;
        font-size: 28rpx;
        line-height: 1.8;
        // color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
    }

    .loading,
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.55);
    }

    .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 90rpx;
        line-height: 90rpx;
        width: 100%;
        border-radius: 90rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
    }

    .disagree-btn {
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 28rpx;
    }
}

.content {
    margin: 30rpx 0;
    height: 75vh;
    background: rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    border: 0.5rpx solid #FFFFFF;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    font-weight: 300;
    overflow-y: scroll;
    padding: 30rpx;
    box-sizing: border-box;

    input {
        text-align: center;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        height: 110rpx;
        line-height: 110rpx;
        color: #fff;
    }

    textarea {
        margin-top: 20rpx;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 20rpx;
        color: #fff;
        width: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        height: 200rpx;
    }

    .title {
        margin: 30rpx 0;
    }

    .images {
        display: flex;
        flex-wrap: wrap;

        .update {
            background: rgba(255, 255, 255, 0.1);
            width: 30%;
            height: 330rpx;
            border-radius: 15rpx;
            font-size: 100rpx;
            text-align: center;
            line-height: 330rpx;
            margin-right: 3.33%;
            margin-bottom: 20rpx;
            position: relative;
            overflow: hidden;

            image {
                width: 100%;
                height: 100%;
            }

            .close {
                position: absolute;
                right: 10rpx;
                top: 10rpx;
            }
        }

    }
}

.images .update:nth-of-type(3n) {
    margin-right: 0 !important;
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .top {
        display: flex;
        align-items: center;

        text {
            margin-left: 20rpx;
            color: rgba(255, 255, 255, 0.5);
        }
    }

    .btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1rpx solid rgba(255, 255, 255, 0.17);
        width: 80%;
        height: 90rpx;
        line-height: 90rpx;
        border-radius: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20rpx;

        image {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;

        }
    }
}
</style>